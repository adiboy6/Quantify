import os
import fitz 
from langchain.embeddings import HuggingFaceEmbeddings
from langchain.vectorstores import FAISS
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_groq import ChatGroq
from dotenv import load_dotenv

load_dotenv()
# Extract text from a PDF
def extract_text_from_pdf(pdf_path):
    document = fitz.open(pdf_path)
    text = ""
    for page_num in range(len(document)):
        page = document.load_page(page_num)
        text += page.get_text("text")
    return text

# Split text into manageable chunks for RAG
def split_text_into_chunks(text, chunk_size=1000, chunk_overlap=200):
    text_splitter = RecursiveCharacterTextSplitter(
        chunk_size=chunk_size,
        chunk_overlap=chunk_overlap,
        length_function=len,
    )
    return text_splitter.split_text(text)

# Create a vector store from text chunks
def create_vector_store(chunks):
    embeddings = HuggingFaceEmbeddings(model_name="sentence-transformers/all-MiniLM-L6-v2")
    return FAISS.from_texts(chunks, embeddings)

# Perform retrieval-augmented generation (RAG)
def perform_rag(vector_store, query):
    retriever = vector_store.as_retriever()
    docs = retriever.get_relevant_documents(query)
    context = " ".join([doc.page_content for doc in docs])
    return context

# Parse the Llama output
def parse_output(output):
    output_content = output.content
    start_index = output_content.find('content="') + len('content="')
    end_index = output_content.rfind('"')
    return output_content[start_index:end_index].replace('\\n', '\n')

# Generate the cover letter using Llama3
def generate_cover_letter(pdf_path, job_role, company_name, company_context):
    text = extract_text_from_pdf(pdf_path)
    chunks = split_text_into_chunks(text)
    vector_store = create_vector_store(chunks)
    candidate_profile = perform_rag(vector_store, job_role)

    chat = ChatGroq(
        temperature=0.5,
        model="llama3-70b-8192",
        api_key=os.getenv("GROQ_API_KEY"),
    )

    system = "Write a professional and tailored cover letter for the following job description and resume as reference:"
    human = f"""
    So, I am applying for {job_role} at {company_name}
    =================
    {company_context}
    =================
    {candidate_profile}
    =================
    From the company profile and my profile, please create a cover letter for the {job_role} position. Ensure that it is well-crafted and engaging for recruiters and hiring managers. Also, verify that my profile fits the role and the company context.
    """
    output = chat.generate(system=system, human=human)
    return parse_output(output)
