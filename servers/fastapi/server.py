import os
import uvicorn
import argparse


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Run the FastAPI server")
    parser.add_argument(
        "--port", type=int, required=True, help="Port number to run the server on"
    )
    parser.add_argument(
        "--reload", type=bool, default=False, help="Reload the server on code changes"
    )
    args = parser.parse_args()

    uvicorn.run(
        "api.main:app",
        host="0.0.0.0",
        port=args.port,
        log_level="info",
        reload=args.reload,
    )
