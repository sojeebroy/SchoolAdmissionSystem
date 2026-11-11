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
COPY ["SchoolAdmissionSystem.API/SchoolAdmissionSystem.API.csproj", "./SchoolAdmissionSystem.API/"]
COPY ["SchoolAdmissionSystem.Domain/SchoolAdmissionSystem.Domain.csproj", "./SchoolAdmissionSystem.Domain/"]
COPY ["SchoolAdmissionSystem.Infrastructure/SchoolAdmissionSystem.Infrastructure.csproj", "./SchoolAdmissionSystem.Infrastructure/"]

# Restore dependencies
RUN dotnet restore "./SchoolAdmissionSystem.API/SchoolAdmissionSystem.API.csproj"

# Copy all source code
COPY . .

# Expose ports
EXPOSE 8080 8081 5555

# Watch mode for hot reload
WORKDIR /app/SchoolAdmissionSystem.API
CMD ["dotnet", "watch", "run", "--urls", "http://+:8080"]