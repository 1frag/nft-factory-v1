run_backend:
	cd web2/backend && uvicorn app:app --reload

run_prod_backend:
    python3.9 -m uvicorn --host 127.23.2.4 app:app --reload
