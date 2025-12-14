import os
from typing import List, Dict, Any, Optional
from datetime import datetime

import chromadb
from chromadb.config import Settings as ChromaSettings
from datasets import load_dataset
from sentence_transformers import SentenceTransformer
from tqdm import tqdm

from app.utils.logger import rag_logger
from app.config import settings

class TherapyDatasetProcessor:
    """Handles processing and standardization of various therapy datasets"""
    
    # Dataset configurations with verified column names
    # "text_column": single column containing text
    # "text_columns": list of columns to combine (e.g., Context + Response)
    DATASET_CONFIGS = {
        # Verified working datasets with correct column mappings
        "Amod/mental_health_counseling_conversations": {"text_columns": ["Context", "Response"]},
        "LuangMV97/Empathetic_counseling_Dataset": {"text_column": "input"},
        "ShenLab/MentalChat16K": {"text_columns": ["instruction", "input", "output"]},
        "IINOVAII/therapy-conversations-combined": {"text_columns": ["instruction", "input", "output"]},
        "anirudh2403/therapy-conversation-synthetic": {"text_column": "Conversations"},
        "MeetX/mental-health-dataset-mistral7b": {"text_column": "text"},
        "marmikpandya/mental-health": {"text_columns": ["instruction", "output"]},
        "dair-ai/emotion": {"text_column": "text"},
    }

    def __init__(self):
        self.logger = rag_logger.getChild("DatasetProcessor")

    def load_dataset(self, dataset_name: str) -> List[Dict[str, Any]]:
        """Load and process a dataset from Hugging Face"""
        try:
            config = self.DATASET_CONFIGS[dataset_name]
            dataset = load_dataset(dataset_name)
            processed_data = []

            for split in dataset.keys():
                data = dataset[split]
                for item in data:
                    # Handle single column or multiple columns to combine
                    if "text_column" in config:
                        raw_text = item.get(config["text_column"], "")
                        used_cols = [config["text_column"]]
                    elif "text_columns" in config:
                        # Combine multiple columns (e.g., Context + Response)
                        parts = []
                        for col in config["text_columns"]:
                            if col in item and item[col]:
                                parts.append(f"{col}: {item[col]}")
                        raw_text = "\n".join(parts)
                        used_cols = config["text_columns"]
                    else:
                        continue
                    
                    processed_text = self._process_text(raw_text)
                    if processed_text:
                        processed_data.append({
                            "text": processed_text,
                            "metadata": {
                                "source": dataset_name,
                                "split": split,
                                **{k: v for k, v in item.items() if k not in used_cols}
                            }
                        })

            self.logger.info(f"Processed {len(processed_data)} entries from {dataset_name}")
            return processed_data
        except Exception as e:
            self.logger.error(f"Error processing dataset {dataset_name}: {str(e)}")
            return []

    def _process_text(self, text: str) -> Optional[str]:
        """Clean and standardize text data"""
        if not isinstance(text, str):
            return None
        
        # Basic cleaning
        text = text.strip()
        text = " ".join(text.split())  # Normalize whitespace
        
        # Filter out empty or very short texts
        if len(text) < 10:
            return None
            
        return text

class TherapyRAG:
    """Main RAG system for therapy conversations"""
    
    def __init__(self, vector_db_path: str = None):
        self.logger = rag_logger.getChild("TherapyRAG")
        self.vector_db_path = vector_db_path or settings.VECTOR_DB_PATH
        self.collection_name = "therapy_conversations"
        
        # Initialize ChromaDB
        self.chroma_client = chromadb.PersistentClient(
            path=self.vector_db_path,
            settings=ChromaSettings(
                anonymized_telemetry=False,
                allow_reset=True
            )
        )
        
        # Initialize sentence transformer
        self.embedding_model = SentenceTransformer(settings.EMBEDDING_MODEL)
        
        # Get or create collection
        self.collection = self.chroma_client.get_or_create_collection(
            name=self.collection_name,
            metadata={"hnsw:space": "cosine"}
        )
        
        self.dataset_processor = TherapyDatasetProcessor()

    async def load_and_index_datasets(self) -> None:
        """Load and index all configured datasets"""
        try:
            total_documents = 0
            
            for dataset_name in tqdm(TherapyDatasetProcessor.DATASET_CONFIGS.keys()):
                self.logger.info(f"Processing dataset: {dataset_name}")
                
                # Load and process dataset
                documents = self.dataset_processor.load_dataset(dataset_name)
                if not documents:
                    continue
                
                # Process in batches
                batch_size = settings.BATCH_SIZE
                for i in range(0, len(documents), batch_size):
                    batch = documents[i:i + batch_size]
                    
                    # Prepare batch data
                    texts = [doc["text"] for doc in batch]
                    ids = [f"{dataset_name}-{i+j}" for j in range(len(batch))]
                    metadatas = [doc["metadata"] for doc in batch]
                    
                    # Generate embeddings
                    embeddings = self.embedding_model.encode(texts)
                    
                    # Add to ChromaDB
                    self.collection.add(
                        documents=texts,
                        embeddings=embeddings.tolist(),
                        ids=ids,
                        metadatas=metadatas
                    )
                    
                    total_documents += len(batch)
                    
            self.logger.info(f"Successfully indexed {total_documents} documents")
            
        except Exception as e:
            self.logger.error(f"Error in load_and_index_datasets: {str(e)}")
            raise

    async def retrieve(self, query: str, n_results: int = None) -> List[Dict[str, Any]]:
        """Retrieve similar documents for a query"""
        try:
            if n_results is None:
                n_results = settings.RAG_N_RESULTS
                
            # Generate query embedding
            query_embedding = self.embedding_model.encode(query)
            
            # Query ChromaDB
            results = self.collection.query(
                query_embeddings=[query_embedding.tolist()],
                n_results=n_results,
                include=["documents", "metadatas", "distances"]
            )
            
            # Format results
            formatted_results = []
            for i in range(len(results["documents"][0])):
                formatted_results.append({
                    "text": results["documents"][0][i],
                    "metadata": results["metadatas"][0][i],
                    "distance": results["distances"][0][i]
                })
                
            return formatted_results
            
        except Exception as e:
            self.logger.error(f"Error in retrieve: {str(e)}")
            return []

    async def get_context_for_llm(self, query: str, n_results: int = None) -> str:
        """Format retrieved context for LLM prompting"""
        results = await self.retrieve(query, n_results)
        if not results:
            return ""
            
        context_parts = []
        for i, result in enumerate(results, 1):
            context_parts.append(f"Example {i}:\n{result['text']}\nSource: {result['metadata']['source']}\n")
            
        return "\n".join(context_parts)

    def get_stats(self) -> Dict[str, Any]:
        """Get database statistics"""
        try:
            count = self.collection.count()
            return {
                "total_documents": count,
                "collection_name": self.collection_name,
                "embedding_model": settings.EMBEDDING_MODEL,
                "last_updated": datetime.now()
            }
        except Exception as e:
            self.logger.error(f"Error in get_stats: {str(e)}")
            return {
                "total_documents": 0,
                "collection_name": self.collection_name,
                "embedding_model": settings.EMBEDDING_MODEL,
                "last_updated": None
            }