# Building Documentation Locally

This guide explains how to build and serve the MkDocs documentation locally for development and testing.

## Prerequisites

- Python 3.8 or higher
- pip package manager

## Installation

### 1. Create a Virtual Environment (Recommended)

```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

### 2. Install Dependencies

```bash
pip install -r requirements-docs.txt
```

Or install manually:

```bash
pip install mkdocs mkdocs-material mkdocs-git-revision-date-localized pymdown-extensions
```

## Building Documentation

### Serve Locally (Development)

```bash
mkdocs serve
```

This will:
- Build the documentation
- Start a local server at `http://localhost:8000`
- Watch for file changes and auto-reload

### Build Static Site

```bash
mkdocs build
```

This will:
- Generate static HTML files in the `site/` directory
- Ready for deployment to GitHub Pages

## Configuration

The documentation is configured in `mkdocs.yml`. Key configurations:

- **Site name**: Hacktoolkit HTK
- **Theme**: Material for MkDocs
- **Documentation root**: `docs/` directory
- **Navigation**: Defined in `nav` section of mkdocs.yml

## File Structure

```
docs/
├── index.md              # Home page
├── components/           # Component documentation
│   ├── index.md
│   └── dialogs/
├── features/            # Feature documentation
│   ├── index.md
│   ├── appsettings/
│   ├── theme/
│   └── expo/
├── utils/               # Utility documentation
│   ├── index.md
│   ├── string.md
│   ├── enum.md
│   └── ...
├── storages/            # Storage documentation
├── states/              # State management docs
└── types/               # Type definitions docs
```

## Adding New Documentation

1. Create a new `.md` file in the appropriate folder
2. Add an entry to the `nav` section in `mkdocs.yml`
3. Use the following front matter for consistency:

```markdown
# Page Title

## Overview
Brief description of the topic.

## Usage
Examples and how-tos.

## API Reference
Detailed function/component signatures.

## Best Practices
Recommended patterns.
```

## Deployment

### Automatic (GitHub Actions)

Documentation is automatically deployed to GitHub Pages when:
- Changes are pushed to the `master` branch
- Files in `docs/`, `mkdocs.yml`, or `**.md` are modified

The workflow is defined in `.github/workflows/deploy-docs.yml`

### Manual Deployment

```bash
mkdocs gh-deploy
```

This will:
- Build the documentation
- Push to the `gh-pages` branch
- Deploy to GitHub Pages

## Troubleshooting

### Import Error: No module named 'mkdocs'

```bash
pip install -r requirements-docs.txt
```

### Port 8000 Already in Use

```bash
mkdocs serve -a localhost:8001
```

### Changes Not Reflecting

- Stop the server (Ctrl+C)
- Rebuild: `mkdocs serve`
- Clear browser cache (Ctrl+Shift+Delete)

## Documentation Standards

- Use Markdown format (`.md`)
- Follow the existing structure and naming conventions
- Include code examples in appropriate language blocks
- Use meaningful headers and sections
- Keep documentation up-to-date with code changes

## More Information

- [MkDocs Documentation](https://www.mkdocs.org/)
- [Material Theme Guide](https://squidfunk.github.io/mkdocs-material/)
- [Markdown Reference](https://www.markdownguide.org/)

