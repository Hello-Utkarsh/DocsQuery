from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi import FastAPI, File, UploadFile
from PyPDF2 import PdfReader
from langchain.text_splitter import CharacterTextSplitter
from langchain_cohere import CohereRagRetriever
from langchain_cohere import ChatCohere
from langchain_core.documents import Document
from pydantic import BaseModel
from dotenv import load_dotenv
import os
load_dotenv()

class Data(BaseModel):
  file: str
  question: str

app = FastAPI()

app.add_middleware(
  CORSMiddleware,
  allow_origins = ['*'],
  allow_methods = ['*'],
  allow_headers = ['*']
)

@app.get("/user/{userid}")
async def get_user(userid) -> list[str]:
  if not userid:
      raise HTTPException(status_code=400, detail="User ID is required")
  if os.path.isdir(f"userdocs/{userid}/"):
    userFiles = os.listdir(f"userdocs/{userid}/")
    return userFiles
  else:
     raise HTTPException(status_code=401, detail="Please login/signin first") 

@app.post("/files/upload/{userid}")
async def upload_filet(userid, file: UploadFile = File(...)):
    content = await file.read()
    os.makedirs(f'userdocs/{userid}', exist_ok=True)
    with open(f"userdocs/{userid}/{file.filename}", "wb") as f:
        f.write(content)
    return {'filename': file.filename}
    
@app.post("/files/ask/{userid}")
async def ask_file(userid: str, data: Data):
  reader = PdfReader(f"userdocs/{userid}/{data.file}")
  text = ""
  for page in reader.pages:
    text += page.extract_text()
  text_splitter = CharacterTextSplitter(
    separator="\n",
    chunk_size=1000,
    chunk_overlap=200,
    length_function=len,
    is_separator_regex=False,
  ) 
  texts = text_splitter.split_text(text)
  text_document = []
  for i in texts:
    text_document.append(Document(page_content=i))
  secret_key = os.environ.get("COHERE_API_KEY")
  llm = ChatCohere(
    COHERE_API_KEY=secret_key, model="command-a-03-2025"
  )
  rag = CohereRagRetriever(llm=llm, connectors=[])
  docs = rag.invoke(
    f"{data.question}",
    documents=text_document,
  )
  answer = docs[-1].page_content
  print(answer)
  return {'answer': answer}