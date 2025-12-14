import asyncio
import sys
import os

# Add the parent directory to sys.path to allow importing app modules
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.rag_system import TherapyRAG
from app.utils.logger import rag_logger

async def main():
    print("🚀 Starting RAG Initialization...")
    print("This process will download and index all configured datasets.")
    print("You can continue using the AI Therapist app while this runs.")
    print("-" * 50)
    
    try:
        rag = TherapyRAG()
        await rag.load_and_index_datasets()
        
        stats = rag.get_stats()
        print("\n✅ RAG Initialization Complete!")
        print(f"Total Documents: {stats['total_documents']}")
        print(f"Collection: {stats['collection_name']}")
        
    except Exception as e:
        print(f"\n❌ Error during initialization: {str(e)}")
        rag_logger.error(f"Initialization error: {str(e)}")

if __name__ == "__main__":
    asyncio.run(main())
