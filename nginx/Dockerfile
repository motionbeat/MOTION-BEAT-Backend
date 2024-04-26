# Dockerfile
FROM nginx:latest
# Install wait-on
RUN npm install -g wait-on
# Wait for other services to be ready before starting Nginx
CMD wait-on tcp:3000 tcp:5001 && nginx -g 'daemon off;'