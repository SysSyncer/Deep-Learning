# Docker Deployment Guide

This application is containerized and can be run using Docker. The Docker image is automatically built and published to GitHub Container Registry (ghcr.io) when changes are pushed to the main branch.

## 🚀 Quick Start

### Using Docker Compose (Recommended)

```bash
# Build and run the container
docker-compose up -d

# View logs
docker-compose logs -f

# Stop the container
docker-compose down
```

The application will be available at: **http://localhost:8080**

### Using Docker CLI

```bash
# Build the image
docker build -t neural-network-playground .

# Run the container
docker run -d -p 8080:80 --name neural-network-playground neural-network-playground

# View logs
docker logs -f neural-network-playground

# Stop the container
docker stop neural-network-playground
docker rm neural-network-playground
```

## 📦 Pulling from GitHub Container Registry

Once the GitHub Actions workflow runs, you can pull the pre-built image:

```bash
# Pull the latest image
docker pull ghcr.io/sivasks2004/neuralnetworkplayground-dl:latest

# Run it
docker run -d -p 8080:80 ghcr.io/sivasks2004/neuralnetworkplayground-dl:latest
```

## 🏷️ Available Tags

- `latest` - Latest build from main branch
- `main` - Latest build from main branch
- `v*` - Semantic version tags (e.g., v1.0.0)
- `sha-<commit>` - Specific commit builds

## 🛠️ Development

### Building Locally

```bash
# Build the image
docker build -t neural-network-playground:dev .

# Run with hot reload (mount source code)
docker run -d -p 8080:80 \
  -v $(pwd)/src:/app/src \
  neural-network-playground:dev
```

### Multi-Architecture Builds

The GitHub Actions workflow automatically builds for:
- `linux/amd64` (Intel/AMD processors)
- `linux/arm64` (Apple M1/M2, ARM servers)

## 🔧 Configuration

### Environment Variables

You can pass environment variables to customize the application:

```bash
docker run -d -p 8080:80 \
  -e REACT_APP_API_BASE=https://api.example.com \
  neural-network-playground
```

### Custom Port

To run on a different port:

```bash
docker run -d -p 3000:80 neural-network-playground
```

## 📊 Health Check

The container includes a health check that runs every 30 seconds:

```bash
# Check container health
docker ps

# Manual health check
docker exec neural-network-playground wget --spider http://localhost/
```

## 🔍 Troubleshooting

### View container logs
```bash
docker logs neural-network-playground
```

### Access container shell
```bash
docker exec -it neural-network-playground sh
```

### Rebuild without cache
```bash
docker build --no-cache -t neural-network-playground .
```

## 📝 Notes

- The application is built using a multi-stage Docker build for optimal image size
- Static assets are served by nginx with gzip compression enabled
- The image size is approximately 50-60MB (Alpine-based)
- Production build is optimized and minified

## 🔐 GitHub Container Registry Access

To pull private images, you need to authenticate:

```bash
echo $GITHUB_TOKEN | docker login ghcr.io -u USERNAME --password-stdin
```

## 🌐 Deployment Options

### Deploy to Cloud Platforms

The containerized application can be deployed to:
- **AWS ECS/Fargate** - Container orchestration
- **Google Cloud Run** - Serverless containers
- **Azure Container Instances** - Simple container hosting
- **DigitalOcean App Platform** - PaaS with Docker support
- **Railway** - Simple Docker deployments
- **Fly.io** - Edge container hosting

### Kubernetes Deployment

Example Kubernetes deployment:

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: neural-network-playground
spec:
  replicas: 3
  selector:
    matchLabels:
      app: neural-network-playground
  template:
    metadata:
      labels:
        app: neural-network-playground
    spec:
      containers:
      - name: app
        image: ghcr.io/sivasks2004/neuralnetworkplayground-dl:latest
        ports:
        - containerPort: 80
        resources:
          limits:
            memory: "128Mi"
            cpu: "100m"
---
apiVersion: v1
kind: Service
metadata:
  name: neural-network-playground
spec:
  selector:
    app: neural-network-playground
  ports:
  - port: 80
    targetPort: 80
  type: LoadBalancer
```

## 🎯 Best Practices

1. **Use specific tags** in production instead of `latest`
2. **Enable health checks** in your orchestration platform
3. **Set resource limits** to prevent memory issues
4. **Use multi-replica deployments** for high availability
5. **Monitor container logs** for errors

## 📚 Additional Resources

- [Docker Documentation](https://docs.docker.com/)
- [GitHub Container Registry](https://docs.github.com/en/packages/working-with-a-github-packages-registry/working-with-the-container-registry)
- [Nginx Documentation](https://nginx.org/en/docs/)
