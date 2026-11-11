# Development stage
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS development
WORKDIR /app

# Install additional dev tools
RUN apt-get update && apt-get install -y \
    curl \
    vim \
    git \
    && rm -rf /var/lib/apt/lists/*

# Copy project file
COPY ["SchoolAdmissionSystem.API.csproj", "."]

# Restore dependencies
RUN dotnet restore "SchoolAdmissionSystem.API.csproj"

# Copy all source code
COPY . .

# Expose ports
EXPOSE 8080

# Watch mode for hot reload
CMD ["dotnet", "watch", "run", "--urls", "http://+:8080"]