# Git y GitHub

## Conceptos básicos

| Concepto | Qué es | Comparación |
|---|---|---|
| **Repositorio** | Carpeta del proyecto con historial de cambios (`.git/`) | Proyecto de Java con "máquina del tiempo" |
| **Commit** | Foto guardada del proyecto, con un mensaje | Guardar el proyecto en tu disco |
| **Rama (branch)** | Línea de trabajo separada | Trabajar en una copia antes de reemplazar la versión buena |
| **Remoto (`origin`)** | La copia del repositorio en GitHub | Servidor compartido |
| **Push** | Subir commits locales a GitHub | Subir tu versión al servidor |
| **Pull** | Traer commits de GitHub a tu PC | Descargar la última versión del servidor |
| **Fetch** | Ver qué hay nuevo en GitHub sin cambiar tus archivos | Revisar el servidor sin descargar nada |
| **Merge** | Traer los commits de otra rama a la rama en la que estás | Unir la copia de trabajo con la versión buena |

## Configurar identidad (una sola vez)

Git necesita saber quién hace los commits:

```
git config --global user.name "nishix_03"
git config --global user.email "ivannihix@gmail.com"
```

- `--global`: vale para todos los repositorios de esa terminal.
- Sin `--global`: solo para el repositorio actual.
- Error típico si falta: `Author identity unknown`.
- Ojo: Windows y WSL tienen configuraciones **separadas**.

## Flujo de trabajo con ramas

```
1. git checkout -b nombre-rama    → crear rama y cambiarte a ella
2. (haces cambios)
3. git add archivo                → preparar cambios (staging)
4. git commit -m "mensaje"        → guardar en tu PC
5. git push -u origin nombre-rama → subir la rama a GitHub
6. git checkout main              → volver a la rama que RECIBE
7. git merge nombre-rama          → traer los cambios a main
8. git push                       → subir main a GitHub
9. git branch -d nombre-rama      → (opcional) borrar la rama local
```

`-u` en el push conecta tu rama local con la remota. Después basta con `git push`.

## Merge: la regla clave

> El merge trae otra rama **hacia la rama en la que estás**.

Por eso primero te cambias a `main` (la que recibe) y luego haces merge de la otra rama.

**Fast-forward (avance rápido):** si `main` no tiene commits propios desde que creaste la rama, Git solo mueve la etiqueta `main` hacia adelante. No crea un commit de merge.

## Comandos para revisar el estado

| Comando | Para qué |
|---|---|
| `git status` | Ver en qué rama estás y si hay cambios pendientes |
| `git status -sb` | Versión corta; muestra `[ahead 1]` si tienes commits sin subir |
| `git log --oneline` | Lista corta de commits |
| `git log --oneline --decorate` | Igual, pero muestra qué ramas apuntan a cada commit |
| `git branch -a` | Todas las ramas, locales y remotas |
| `git branch --show-current` | Solo el nombre de la rama actual |

- `ahead 1` = tienes 1 commit que GitHub no tiene → falta push.
- `behind 1` = GitHub tiene 1 commit que tú no → falta pull.

## Lo mismo en VS Code

| Terminal | VS Code |
|---|---|
| `git add` | **+** junto al archivo (pasa a "Staged Changes") |
| `git commit -m` | Escribir mensaje + botón **Confirmar** (Commit) |
| `git push` / `git pull` | **Sincronizar cambios** (Sync Changes) |
| `git push -u origin rama` | **Publish Branch** |
| `git checkout rama` | Clic en la rama (abajo a la izquierda) o `Ctrl+Shift+P` → `Git: Checkout to` |
| `git merge rama` | `Ctrl+Shift+P` → `Git: Merge` |
| `git branch -d rama` | `Ctrl+Shift+P` → `Git: Delete Branch` |

### Errores que tuve (y cómo detectarlos)

- **Abrir el filtro del Graph creyendo que era merge o checkout.** Ese menú
  ("Seleccione una o varias referencias...") solo cambia **qué ramas se dibujan**.
  No cambia de rama ni une nada.
- **Hacer `Git: Merge` estando en la rama equivocada.** Pista: la rama en la que estás
  **no aparece** en la lista del merge.
- **Cómo saber en qué rama estoy:** el botón dice **"Confirmar en 'nombre-rama'"**,
  y la barra de abajo a la izquierda muestra la rama.
- **Sincronizar no pide mensaje.** Solo el commit lleva mensaje. Sincronizar mueve commits que ya existen.

## GitHub Pages

- Mi portafolio se publica desde `main`, carpeta `docs/`.
- Solo los cambios dentro de `docs/` que llegan a `main` en GitHub cambian la web.
- Trabajar en otra rama es seguro: la web no cambia hasta hacer merge a `main` + push.

## .gitignore

Archivo con la lista de archivos o carpetas que Git debe **ignorar** (no se suben a GitHub).

```
apuntes/      → ignora toda la carpeta
*.log         → ignora todos los archivos .log
```

- El `.gitignore` sí se sube. Se ve el nombre de la carpeta ignorada, pero no su contenido.
- Lo ignorado solo existe en mi PC. **No tiene copia de seguridad** en GitHub.
