---
phase: quick
plan: 260409-cwl
type: execute
wave: 1
depends_on: []
files_modified:
  - presentation/Dockerfile
  - docker-compose.yml
autonomous: true
must_haves:
  truths:
    - "The presentation HTML is served at todogsi.pixelrogue.io via HTTPS"
    - "Docker Compose builds and runs the presentation service alongside existing services"
  artifacts:
    - path: "presentation/Dockerfile"
      provides: "Minimal Python http.server container serving the HTML as index.html"
    - path: "docker-compose.yml"
      provides: "presentation service with Traefik labels for todogsi.pixelrogue.io"
  key_links:
    - from: "docker-compose.yml (presentation service)"
      to: "Traefik"
      via: "labels with Host rule for todogsi.pixelrogue.io"
      pattern: "Host.*todogsi.pixelrogue.io"
---

<objective>
Add a `presentation` service to Docker Compose that serves `screens/apresentacao-telas-nativas.html` as a static page via Python http.server, routed through Traefik to `todogsi.pixelrogue.io`.

Purpose: Make the native screens presentation accessible to clients at a clean URL.
Output: Dockerfile + updated docker-compose.yml with working presentation service.
</objective>

<execution_context>
@$HOME/.claude/get-shit-done/workflows/execute-plan.md
@$HOME/.claude/get-shit-done/templates/summary.md
</execution_context>

<context>
@docker-compose.yml
@screens/apresentacao-telas-nativas.html
</context>

<tasks>

<task type="auto">
  <name>Task 1: Create presentation Dockerfile</name>
  <files>presentation/Dockerfile</files>
  <action>
    Create `presentation/Dockerfile`:

    ```dockerfile
    FROM python:3.12-alpine
    WORKDIR /srv
    COPY index.html .
    EXPOSE 8000
    CMD ["python", "-m", "http.server", "8000"]
    ```

    Then copy the source file into the build context:
    - Copy `screens/apresentacao-telas-nativas.html` to `presentation/index.html`

    This keeps the Dockerfile dead simple -- Alpine Python, single HTML file, no frameworks.
  </action>
  <verify>
    <automated>ls -la presentation/Dockerfile presentation/index.html</automated>
  </verify>
  <done>presentation/Dockerfile exists, presentation/index.html exists (copy of the screens HTML)</done>
</task>

<task type="auto">
  <name>Task 2: Add presentation service to docker-compose.yml</name>
  <files>docker-compose.yml</files>
  <action>
    Add a `presentation` service to `docker-compose.yml` after the `postgres` service block, before `volumes:`. Use the exact same Traefik label pattern as the `frontend` service but with these differences:

    - Router name: `presentation` (not `frontend`)
    - Host rule: `todogsi.pixelrogue.io` (hardcoded, no env var needed -- this is a single-purpose presentation URL)
    - Build context: `./presentation`
    - No depends_on (standalone)
    - Networks: `coolify` only (no internal network needed -- no backend communication)
    - restart: unless-stopped

    The service block should be:

    ```yaml
    presentation:
      build:
        context: ./presentation
        dockerfile: Dockerfile
      restart: unless-stopped
      labels:
        - "traefik.enable=true"
        - "traefik.http.routers.presentation.rule=Host(`todogsi.pixelrogue.io`)"
        - "traefik.http.routers.presentation.entrypoints=websecure"
        - "traefik.http.routers.presentation.tls.certresolver=myresolver"
        - "traefik.docker.network=coolify"
      networks:
        - coolify
    ```
  </action>
  <verify>
    <automated>docker compose config --services 2>/dev/null | grep presentation</automated>
  </verify>
  <done>docker-compose.yml validates and includes `presentation` service with correct Traefik labels for todogsi.pixelrogue.io</done>
</task>

</tasks>

<verification>
- `docker compose config` parses without errors
- `presentation` service appears in service list
- Traefik labels point to `todogsi.pixelrogue.io` on websecure entrypoint
- presentation/Dockerfile and presentation/index.html exist
</verification>

<success_criteria>
- presentation/Dockerfile uses python:3.12-alpine with http.server on port 8000
- presentation/index.html is a copy of screens/apresentacao-telas-nativas.html
- docker-compose.yml has presentation service with Traefik routing to todogsi.pixelrogue.io
- docker compose config validates successfully
</success_criteria>

<output>
After completion, create `.planning/quick/260409-cwl-add-docker-compose-service-to-serve-pres/260409-cwl-SUMMARY.md`
</output>
