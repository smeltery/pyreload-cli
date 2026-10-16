# Docker development

Bind mounts can miss native filesystem events. Enable polling inside the container.

## Container image

```dockerfile
FROM python:3.12-slim
WORKDIR /app
RUN pip install pyreload-cli
COPY . .
CMD ["pyreload", "app.py", "--polling", "--clean"]
```

Install your application's dependencies in the image as well.

## Run with a bind mount

```bash
docker build -t pyreload-demo .
docker run --rm -it -v "$PWD:/app" pyreload-demo
```

Edit a source file on the host and verify the application restarts. Clean mode
keeps the watcher alive without interactive commands. Mount only the source
you need and exclude generated files to reduce polling work.
