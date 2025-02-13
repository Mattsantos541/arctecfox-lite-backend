{ pkgs }: {
    deps = [
        pkgs.python310
        pkgs.uvicorn
        pkgs.python310Packages.fastapi
        pkgs.python310Packages.requests
        pkgs.python310Packages.sanic
        pkgs.python310Packages.pydantic
        pkgs.python310Packages.sqlalchemy
    ];
    # Run backend automatically
    run = "uvicorn main:app --host 0.0.0.0 --port 9000 --reload";
}