## DocsQuery

DocsQuery is a PDF question-answering application built with a React frontend and a FastAPI backend. It allows users to upload PDF documents, extract text, create embeddings, and ask questions about the contents using AI models.

### Backend Setup (FastAPI + uv)

1. Navigate to the backend folder:

```bash
cd backend
```

2. Install dependencies using [uv](https://github.com/astral-sh/uv):

```bash
uv venv    # optional: create virtual environment
uv sync    # install dependencies from pyproject.toml
```

3. Run the FastAPI dev server:

```bash
uv run fastapi dev
```

---

### Frontend Setup (React + Clerk)

1. Navigate to the frontend folder:

```bash
cd frontend
```

2. Install dependencies:

```bash
npm install
```

3. Start the development server:

```bash
npm run dev
```