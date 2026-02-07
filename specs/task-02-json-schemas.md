# Task 2: JSON Schemas definieren

## Ziel
Erstelle die JSON Schemas für Package-Validierung: `bloktastic.schema.json` und `registry.schema.json`.

## Voraussetzungen
- Task 1 abgeschlossen (Repository-Struktur existiert)

## Technische Details

### Validation Library
- **Ajv** (Another JSON Schema Validator) wird im CLI verwendet
- Schemas sind JSON Schema Draft 2020-12

## Zu erstellende Dateien

### `/schema/bloktastic.schema.json`

Dieses Schema validiert einzelne Package-Manifeste (`bloktastic.json`).

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "$id": "https://bloktastic.dev/schema/bloktastic.schema.json",
  "title": "Bloktastic Package Manifest",
  "description": "Schema for bloktastic.json package manifests",
  "type": "object",
  "required": ["name", "type", "version", "title", "description", "author"],
  "properties": {
    "$schema": {
      "type": "string",
      "format": "uri"
    },
    "name": {
      "type": "string",
      "pattern": "^@[a-z0-9-]+/[a-z0-9-]+$",
      "minLength": 5,
      "maxLength": 60,
      "description": "Package name with namespace, e.g. @bloktastic/hero"
    },
    "type": {
      "type": "string",
      "enum": ["component", "plugin", "preset"],
      "description": "Package type"
    },
    "version": {
      "type": "string",
      "pattern": "^\\d+\\.\\d+\\.\\d+$",
      "description": "Semantic version (x.y.z)"
    },
    "title": {
      "type": "string",
      "minLength": 3,
      "maxLength": 100,
      "description": "Human-readable title"
    },
    "description": {
      "type": "string",
      "minLength": 10,
      "maxLength": 500,
      "description": "Package description"
    },
    "author": {
      "type": "object",
      "required": ["name", "github"],
      "properties": {
        "name": {
          "type": "string",
          "minLength": 2
        },
        "github": {
          "type": "string",
          "pattern": "^[a-zA-Z0-9-]+$",
          "description": "GitHub username without @"
        },
        "url": {
          "type": "string",
          "format": "uri"
        }
      }
    },
    "compatibility": {
      "type": "object",
      "properties": {
        "storyblok": {
          "type": "string",
          "pattern": "^[><=]*\\d+\\.\\d+\\.\\d+$",
          "description": "Minimum Storyblok version"
        },
        "storyblokMax": {
          "type": "string",
          "pattern": "^\\d+\\.\\d+\\.\\d+$",
          "description": "Maximum Storyblok version"
        },
        "frameworks": {
          "type": "array",
          "items": {
            "type": "string",
            "enum": ["vue", "nuxt", "react", "nextjs", "astro", "svelte", "agnostic"]
          }
        }
      }
    },
    "tags": {
      "type": "array",
      "items": {
        "type": "string",
        "pattern": "^[a-z0-9-]+$",
        "maxLength": 30
      },
      "maxItems": 10,
      "description": "Searchable tags"
    },
    "category": {
      "type": "string",
      "enum": ["sections", "content", "navigation", "forms", "media", "layout", "commerce"],
      "description": "Primary category"
    },
    "files": {
      "type": "object",
      "properties": {
        "schema": {
          "type": "string",
          "default": "schema.json"
        },
        "prompt": {
          "type": "string",
          "default": "prompt.md"
        },
        "readme": {
          "type": "string",
          "default": "README.md"
        }
      }
    },
    "dependencies": {
      "type": "object",
      "properties": {
        "bloktastic": {
          "type": "array",
          "items": {
            "type": "string",
            "pattern": "^@[a-z0-9-]+/[a-z0-9-]+$"
          },
          "description": "Other Bloktastic packages this depends on"
        }
      }
    },
    "metadata": {
      "type": "object",
      "properties": {
        "created": {
          "type": "string",
          "format": "date"
        },
        "updated": {
          "type": "string",
          "format": "date"
        },
        "status": {
          "type": "string",
          "enum": ["stable", "unmaintained", "deprecated", "archived"],
          "default": "stable"
        }
      }
    }
  },
  "allOf": [
    {
      "if": {
        "properties": { "type": { "const": "component" } }
      },
      "then": {
        "properties": {
          "files": {
            "required": ["schema", "prompt"]
          }
        }
      }
    },
    {
      "if": {
        "properties": { "type": { "const": "preset" } }
      },
      "then": {
        "required": ["includes"],
        "properties": {
          "includes": {
            "type": "array",
            "items": {
              "type": "string",
              "pattern": "^@[a-z0-9-]+/[a-z0-9-]+$"
            },
            "minItems": 1,
            "description": "Components included in this preset"
          }
        }
      }
    }
  ]
}
```

### `/schema/registry.schema.json`

Dieses Schema validiert die zentrale `registry.json`.

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "$id": "https://bloktastic.dev/schema/registry.schema.json",
  "title": "Bloktastic Registry",
  "description": "Schema for the central registry.json",
  "type": "object",
  "required": ["name", "version", "packages"],
  "properties": {
    "$schema": {
      "type": "string",
      "format": "uri"
    },
    "name": {
      "type": "string",
      "const": "bloktastic"
    },
    "version": {
      "type": "string",
      "pattern": "^\\d+\\.\\d+\\.\\d+$"
    },
    "homepage": {
      "type": "string",
      "format": "uri"
    },
    "repository": {
      "type": "string",
      "format": "uri"
    },
    "packages": {
      "type": "object",
      "required": ["components", "plugins", "presets"],
      "properties": {
        "components": {
          "type": "array",
          "items": { "$ref": "#/$defs/packageEntry" }
        },
        "plugins": {
          "type": "array",
          "items": { "$ref": "#/$defs/packageEntry" }
        },
        "presets": {
          "type": "array",
          "items": { "$ref": "#/$defs/packageEntry" }
        }
      }
    },
    "categories": {
      "type": "object",
      "properties": {
        "components": {
          "type": "array",
          "items": { "type": "string" }
        },
        "plugins": {
          "type": "array",
          "items": { "type": "string" }
        }
      }
    },
    "stats": {
      "type": "object",
      "properties": {
        "totalComponents": { "type": "integer", "minimum": 0 },
        "totalPlugins": { "type": "integer", "minimum": 0 },
        "totalPresets": { "type": "integer", "minimum": 0 },
        "lastUpdated": { "type": "string", "format": "date-time" }
      }
    }
  },
  "$defs": {
    "packageEntry": {
      "type": "object",
      "required": ["name", "path", "version", "title"],
      "properties": {
        "name": {
          "type": "string",
          "pattern": "^@[a-z0-9-]+/[a-z0-9-]+$"
        },
        "path": {
          "type": "string",
          "description": "Relative path in registry, e.g. components/hero"
        },
        "version": {
          "type": "string",
          "pattern": "^\\d+\\.\\d+\\.\\d+$"
        },
        "title": {
          "type": "string"
        },
        "tags": {
          "type": "array",
          "items": { "type": "string" }
        },
        "category": {
          "type": "string"
        },
        "status": {
          "type": "string",
          "enum": ["stable", "unmaintained", "deprecated", "archived"]
        }
      }
    }
  }
}
```

### `/schema/config.schema.json`

Schema für die User-Config `bloktastic.config.json`.

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "$id": "https://bloktastic.dev/schema/config.schema.json",
  "title": "Bloktastic Project Config",
  "description": "Schema for bloktastic.config.json in user projects",
  "type": "object",
  "properties": {
    "$schema": {
      "type": "string",
      "format": "uri"
    },
    "space": {
      "type": "object",
      "required": ["id"],
      "properties": {
        "id": {
          "type": "string",
          "pattern": "^\\d+$",
          "description": "Storyblok Space ID"
        },
        "region": {
          "type": "string",
          "enum": ["eu", "us", "ca", "ap"],
          "default": "eu"
        }
      }
    },
    "preferences": {
      "type": "object",
      "properties": {
        "defaultFramework": {
          "type": "string",
          "enum": ["vue", "nuxt", "react", "nextjs", "astro", "svelte"]
        },
        "outputDirectory": {
          "type": "string",
          "default": "./components/storyblok"
        },
        "promptOutput": {
          "type": "string",
          "enum": ["clipboard", "file", "stdout"],
          "default": "clipboard"
        }
      }
    },
    "installedPackages": {
      "type": "array",
      "items": {
        "type": "object",
        "required": ["name", "version", "installedAt"],
        "properties": {
          "name": {
            "type": "string",
            "pattern": "^@[a-z0-9-]+/[a-z0-9-]+$"
          },
          "version": {
            "type": "string"
          },
          "installedAt": {
            "type": "string",
            "format": "date-time"
          }
        }
      }
    }
  }
}
```

## Acceptance Criteria

- [ ] Alle drei Schema-Dateien existieren in `/schema/`
- [ ] Schemas sind valides JSON Schema Draft 2020-12
- [ ] Namespace-Pattern `@user/package` wird korrekt validiert
- [ ] Conditional Validation für Component vs Preset funktioniert
- [ ] Schemas können mit Ajv geladen werden (Test in Task 3)

## Test-Validierung

```bash
# Manueller Test mit ajv-cli
npx ajv validate -s schema/bloktastic.schema.json -d registry/components/hero/bloktastic.json
```

## Nächster Task
→ Task 3: CLI Package Setup
