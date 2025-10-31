"""Small utility to inspect the ChromaDB persistent store used by the RAG system.

This script prints debug information (python executable, package versions),
lists collections, prints collection counts, and attempts to show 1-3 sample
documents with metadata.

Run from the project root inside the backend venv:

    cd backend
    .\.venv\Scripts\activate
    python .\scripts\inspect_chroma.py

If you see no output when running the script, run it as shown above and paste
the terminal output here — the enhanced logging will reveal the cause.
"""

import os
import sys
import json
import traceback
from chromadb.config import Settings as ChromaSettings
import chromadb


def main():
    try:
        print("Python executable:", sys.executable)
        try:
            import chromadb
            print("chromadb version:", getattr(chromadb, '__version__', 'unknown'))
        except Exception:
            print("chromadb import: failed (module may be missing)")

        # Adjust to your VECTOR_DB_PATH if different
        VECTOR_DB_PATH = os.path.join(os.path.dirname(__file__), '..', 'therapy_vector_db')
        VECTOR_DB_PATH = os.path.abspath(VECTOR_DB_PATH)

        print("Vector DB path:", VECTOR_DB_PATH)

        if not os.path.exists(VECTOR_DB_PATH):
            print("WARNING: Vector DB path does not exist on disk.")

        # Create client
        client = chromadb.PersistentClient(
            path=VECTOR_DB_PATH,
            settings=ChromaSettings(anonymized_telemetry=False, allow_reset=False)
        )

        # list collections
        try:
            collections = client.list_collections()
            print("Collections:", [c.get('name') for c in collections])
        except Exception as e:
            print("Error listing collections:", str(e))
            traceback.print_exc()
            return

        # inspect a known collection name (default in project: 'therapy_conversations')
        col_name = 'therapy_conversations'
        try:
            coll = client.get_collection(name=col_name)
        except Exception as e:
            print(f"Collection '{col_name}' not found or error getting it:", str(e))
            traceback.print_exc()
            return

        try:
            count = coll.count()
            print(f"Collection '{col_name}' count:", count)
        except Exception as e:
            print("Error getting collection count:", str(e))
            traceback.print_exc()
            return

        # fetch a few documents and metadata
        if count > 0:
            try:
                # Use `peek` to retrieve a small sample from the collection.
                # `peek` is supported by chromadb and returns the first `n` items
                # including ids, documents and metadatas depending on include.
                try:
                    sample = coll.peek(3, include=['documents', 'metadatas', 'ids'])
                except TypeError:
                    # older/newer versions may have different signature; try without include
                    sample = coll.peek(3)

                print("Sample documents (peek):")
                print(json.dumps(sample, indent=2, ensure_ascii=False))
            except Exception as e:
                print("Error fetching sample documents with peek:", str(e))
                traceback.print_exc()
        else:
            print("Collection is empty.")

    except Exception as e:
        print("Unhandled error:", str(e))
        traceback.print_exc()


if __name__ == '__main__':
    main()