# Usa Node.js 20 (amd64) como base
FROM --platform=linux/amd64 node:20

# Establecer directorio de trabajo
WORKDIR /app

# Define un argumento para elegir la estrategia de instalación (por defecto, npm ci)
ARG USE_NPM_CI=true

# Copiar los archivos de dependencia antes que el resto para aprovechar la caché
COPY package*.json ./

RUN npm install -g @angular/cli --save-dev 

#COPY . .
# Instalar dependencias según el argumento:
# Si USE_NPM_CI es "true" se usará npm ci, de lo contrario npm install.
RUN if [ "$USE_NPM_CI" = "true" ]; then \
        npm ci; \ 
    else \
        npm install; \
    fi

# Instalar Angular CLI globalmente (opcional, si lo necesitas para ng serve)

# Copiar el resto de la aplicacións
COPY . .

RUN if [ "$USE_NPM_CI" = "true" ]; then \
    npx ng build --configuration production; \
    fi


# Exponer el puerto donde se levantará el servidor de desarrollo (4200)
EXPOSE 4200

CMD ["ng", "serve", "--host", "0.0.0.0", "--poll=2000"]



# FROM --platform=linux/amd64 node:20

# WORKDIR /app

# ARG USE_NPM_CI=true

# # 1. Copiar solo archivos de dependencias primero
# COPY package*.json ./

# # 2. Instalar Angular CLI y dependencias
# RUN npm install -g @angular/cli

# # 3. Instalación condicional y build
# RUN if [ "$USE_NPM_CI" = "true" ]; then \
#         npm ci; \
#         ng build --configuration production --output-hashing none; \
#     else \
#         npm install; \
#     fi

# # 4. Copiar el resto del código (IMPORTANTE: debe ir después del build si usas CI)
# COPY . .

# # 5. Exponer y ejecutar
# EXPOSE 4200
# CMD ["ng", "serve", "--host", "0.0.0.0", "--poll=2000"]


####
#Advertencia importante: Si usas USE_NPM_CI=true, el COPY . . debe ir DESPUÉS del build porque:
 #   Primero instalas dependencias
 #   Luego haces el build con el código que ya estaba en el contexto del Dockerfile
 #   Finalmente copias el código nuevo
###