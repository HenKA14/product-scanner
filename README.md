# 📱 Product Scanner App

![Product Scanner](https://img.shields.io/badge/Next.js-14-black?logo=next.js)
![React](https://img.shields.io/badge/React-18-blue?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3-38bdf8?logo=tailwindcss)

Aplicación web mobile-first para buscar productos por código de barras utilizando la API de OpenFoodFacts. Muestra información detallada del producto con precio simulado y mantiene un historial de búsquedas persistente.

## 🚀 Demo en Vivo

> **Nota:** Desplegar en Vercel con un solo click:
> 
> [![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/tu-usuario/product-scanner)

## ✨ Características Principales

### 🔍 Búsqueda de Productos
- ✅ Input con validación en tiempo real (6-13 dígitos)
- ✅ **Escáner de cámara en tiempo real** con html5-qrcode
- ✅ Detección automática de códigos de barras
- ✅ Búsqueda mediante código de barras
- ✅ Consulta a API de OpenFoodFacts
- ✅ Indicadores visuales de validación

### 📦 Visualización de Productos
- ✅ Card detallada con información completa
- ✅ Imagen del producto optimizada con Next.js
- ✅ Nombre, marca y categoría
- ✅ Precio simulado (S/. 5.00 - S/. 150.00)
- ✅ Estados de loading, error y empty state

### 📚 Historial de Búsquedas
- ✅ Guardado automático en localStorage
- ✅ Límite de 20 productos (FIFO)
- ✅ Click en item muestra producto
- ✅ Botón para limpiar historial
- ✅ Persistencia entre sesiones
- ✅ Timestamps relativos ("Hace 5 minutos")

### 🎨 UI/UX
- ✅ Diseño mobile-first responsive
- ✅ Interfaz moderna y limpia
- ✅ Animaciones suaves
- ✅ Estados visuales claros
- ✅ Accesibilidad (ARIA, focus states)

## 🛠️ Stack Tecnológico

- **Framework:** Next.js 14+ (App Router)
- **Biblioteca UI:** React 18+
- **Lenguaje:** TypeScript (strict mode)
- **Estilos:** Tailwind CSS
- **Escáner:** html5-qrcode para detección de códigos de barras
- **API:** OpenFoodFacts REST API
- **Storage:** LocalStorage API
- **Optimización:** next/image para imágenes

## 📁 Estructura del Proyecto

```
product-scanner/
├── src/
│   ├── app/
│   │   ├── layout.tsx          # Layout principal con header/footer
│   │   ├── page.tsx             # Página principal (homepage)
│   │   └── globals.css          # Estilos globales y utilidades
│   ├── components/
│   │   ├── BarcodeInput.tsx     # Input de búsqueda con validación
│   │   ├── ProductCard.tsx      # Card de producto con detalles
│   │   ├── SearchHistory.tsx    # Lista de historial de búsquedas
│   │   ├── LoadingState.tsx     # Estado de carga
│   │   ├── ErrorState.tsx       # Estado de error
│   │   └── EmptyState.tsx       # Estado vacío inicial
│   ├── lib/
│   │   ├── api.ts               # Funciones para fetch de API
│   │   ├── storage.ts           # Funciones para localStorage
│   │   └── utils.ts             # Utilidades generales
│   └── types/
│       └── product.ts           # Interfaces TypeScript
├── public/                      # Archivos estáticos
├── .gitignore
├── package.json
├── tsconfig.json
├── tailwind.config.ts
├── next.config.js
└── README.md
```

## 📦 Instalación y Uso

### Requisitos Previos
- Node.js 18+ instalado
- npm, yarn, pnpm o bun

### Pasos de Instalación

1. **Clonar el repositorio**
```bash
git clone https://github.com/HenKA14/product-scanner.git
cd product-scanner
```

2. **Instalar dependencias**
```bash
npm install
# o
yarn install
# o
pnpm install
```

3. **Ejecutar en desarrollo**
```bash
npm run dev
# o
yarn dev
# o
pnpm dev
```

4. **Abrir en el navegador**
```
http://localhost:3000
```

### Scripts Disponibles

```bash
npm run dev      # Inicia servidor de desarrollo
npm run build    # Genera build de producción
npm run start    # Inicia servidor de producción
npm run lint     # Ejecuta ESLint
```

## 🧪 Códigos de Barras para Pruebas

Usa estos códigos para probar la aplicación:

| Producto | Código de Barras |
|----------|------------------|
| Coca Cola | `7501055363803` |
| Sabritas Original | `7501000673209` |
| Gansito Marinela | `7501055300006` |
| Nutella | `3017620422003` |
| Coca Cola Light | `5449000000996` |
| Ferrero Rocher | `8076809513685` |
| Aceite de Oliva | `8480000570926` |
| M&M's Peanut | `0016000119208` |
| Perly | `6111242100992` |

## 🔧 Configuración

### Tailwind CSS

El proyecto está configurado con Tailwind CSS. Para personalizar:

```js
// tailwind.config.ts
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: '#2563EB',
        // Agrega tus colores personalizados
      },
    },
  },
}
```

### TypeScript

El proyecto usa TypeScript en modo estricto. Configuración en `tsconfig.json`:

```json
{
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true
  }
}
```

## 📡 API de OpenFoodFacts

La aplicación consume la API REST de OpenFoodFacts:

**Endpoint:** `https://world.openfoodfacts.org/api/v0/product/[BARCODE].json`

**Respuesta ejemplo:**
```json
{
  "status": 1,
  "product": {
    "product_name": "Coca-Cola",
    "brands": "Coca-Cola",
    "image_url": "https://...",
    "categories": "Beverages",
    "code": "7501055363803"
  }
}
```

### Manejo de Errores

- `status: 0` → Producto no encontrado
- Campos vacíos → Se usan valores por defecto
- Error de red → Mensaje de error genérico

## 💾 LocalStorage

El historial se guarda en localStorage con la clave `product-scanner-history`:

**Estructura:**
```typescript
interface SearchHistoryItem {
  product: Product;
  price: number;
  timestamp: number;
}
```

**Características:**
- Máximo 20 items (FIFO)
- Persistencia entre sesiones
- Actualización automática de timestamps

## 🎨 Diseño Responsive

### Breakpoints

- **Mobile:** < 768px (diseño principal)
- **Tablet:** 768px - 1024px
- **Desktop:** > 1024px

### Comportamiento por Dispositivo

**Mobile (< 768px):**
- Stack vertical
- Input full-width
- Historial debajo del resultado

**Tablet (768px - 1024px):**
- Grid 2 columnas en historial
- Espaciado optimizado

**Desktop (> 1024px):**
- Grid 2/3 columnas (contenido | historial)
- Historial sticky en sidebar
- Hover effects mejorados

## 💡 Decisiones Técnicas

### ¿Por qué Next.js App Router?

- ✅ Server Components por defecto (mejor performance)
- ✅ Sistema de routing basado en archivos
- ✅ Optimización automática de imágenes
- ✅ TypeScript integrado
- ✅ Soporte SSR/SSG/ISR

### ¿Por qué LocalStorage?

- ✅ No requiere backend adicional
- ✅ Persistencia simple y efectiva
- ✅ Acceso síncrono rápido
- ✅ Soporte universal en navegadores

### ¿Por qué Tailwind CSS?

- ✅ Utility-first approach
- ✅ Mobile-first por diseño
- ✅ No hay CSS en conflicto
- ✅ Purge automático (bundle pequeño)
- ✅ Desarrollo rápido

## 🚀 Despliegue en Producción

### Vercel (Recomendado)

1. Conecta tu repositorio de GitHub
2. Vercel detecta automáticamente Next.js
3. Deploy automático en cada push

```bash
# O usando Vercel CLI
npm i -g vercel
vercel
```

### Otras Plataformas

**Netlify:**
```bash
npm run build
# Despliega la carpeta .next
```

**Docker:**
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
CMD ["npm", "start"]
```

## 🧪 Testing

### Testing Manual

1. ✅ Probar con todos los códigos de barras provistos
2. ✅ Verificar responsive (mobile, tablet, desktop)
3. ✅ Verificar persistencia del historial
4. ✅ Verificar límite de 20 items
5. ✅ Verificar estados (loading, error, success, empty)
6. ✅ Verificar validación de input

### Testing con DevTools

- **Network Tab:** Verificar requests a API
- **Application Tab:** Verificar localStorage
- **Console:** Sin errores en consola
- **Lighthouse:** Performance y accesibilidad

## 📊 Performance

### Métricas Objetivo

- **FCP (First Contentful Paint):** < 1.5s
- **LCP (Largest Contentful Paint):** < 2.5s
- **CLS (Cumulative Layout Shift):** < 0.1
- **FID (First Input Delay):** < 100ms

### Optimizaciones Implementadas

- ✅ Next.js Image optimization
- ✅ Code splitting automático
- ✅ CSS purging con Tailwind
- ✅ Lazy loading de imágenes
- ✅ Memoización de componentes

## ♿ Accesibilidad

- ✅ Labels semánticos en inputs
- ✅ Alt text en imágenes
- ✅ Contraste WCAG AA
- ✅ Navegación por teclado
- ✅ Focus states visibles
- ✅ ARIA labels donde necesario
- ✅ Reduced motion support

## 🐛 Problemas Conocidos

**Limitaciones de la API:**
- Algunos productos pueden no tener imagen
- Información incompleta en algunos productos
- Rate limiting no documentado

**Soluciones Implementadas:**
- Placeholders para imágenes faltantes
- Valores por defecto para campos vacíos
- Manejo robusto de errores

## 🔮 Mejoras Futuras (Roadmap)

### Alta Prioridad
- [ ] Scanner de cámara con html5-qrcode
- [ ] Dark mode toggle
- [ ] PWA (Progressive Web App)
- [ ] Filtros en historial

### Media Prioridad
- [ ] React Query para cache
- [ ] Zustand para estado global
- [ ] Tests con Vitest + RTL
- [ ] i18n (internacionalización)

### Baja Prioridad
- [ ] Animaciones con Framer Motion
- [ ] Exportar historial a CSV
- [ ] Compartir producto por URL
- [ ] Comparador de productos

## 🤝 Contribuciones

Las contribuciones son bienvenidas. Por favor:

1. Fork el proyecto
2. Crea una rama (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver `LICENSE` para más información.

## 👨‍💻 Autor

**Henrique Carhuapoma Capillo**

- 🔗 GitHub: [@HenKA14](https://github.com/HenKA14)
- 💼 LinkedIn: [Henrique Carhuapoma](https://www.linkedin.com/in/henriqueccc)
- 📧 Full Stack Developer

## 🙏 Agradecimientos

- [OpenFoodFacts](https://world.openfoodfacts.org/) por la API gratuita
- [Next.js](https://nextjs.org/) por el framework
- [Tailwind CSS](https://tailwindcss.com/) por el sistema de diseño
- [html5-qrcode](https://github.com/mebjas/html5-qrcode) por la librería de escaneo
- [Netlify](https://www.netlify.com/) por el hosting

---

⭐ Si te gustó este proyecto, considera darle una estrella en GitHub

**¿Encontraste un bug?** [Reporta un issue](https://github.com/HenKA14/product-scanner/issues)

**¿Tienes preguntas?** [Inicia una discusión](https://github.com/HenKA14/product-scanner/discussions)
