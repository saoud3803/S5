import zipfile
import os
import json
import re
import sys
import shutil
import unicodedata

sys.stdout.reconfigure(encoding='utf-8')

BASE_DIR = r"S:\S5"
PUBLIC_RESOURCES = os.path.join(BASE_DIR, "public", "resources")
DATA_DIR = os.path.join(BASE_DIR, "src", "data")

# Clean existing public/resources directory to remove deleted modules
if os.path.exists(PUBLIC_RESOURCES):
    shutil.rmtree(PUBLIC_RESOURCES)
os.makedirs(PUBLIC_RESOURCES, exist_ok=True)
os.makedirs(DATA_DIR, exist_ok=True)

ZIPS = [
    r"C:\Users\saoud\Downloads\GC-20260918T175701Z-1-001.zip",
    r"C:\Users\saoud\Downloads\GC-20260918T175701Z-1-002.zip",
]

def slugify(text):
    text = unicodedata.normalize('NFKD', text).encode('ascii', 'ignore').decode('utf-8')
    text = re.sub(r'[^\w\s-]', '', text).strip().lower()
    return re.sub(r'[-\s]+', '-', text)

def classify_file(module, original_cat, filename):
    lower_cat = original_cat.lower()
    lower_file = filename.lower()
    
    if ('corrige' in lower_file or 'corrigé' in lower_file or '+solution' in lower_file or 
        'solution' in lower_file or 'soluton' in lower_file or 'corrig' in lower_cat):
        return "Corriges", "✅ Corrigés"
        
    if ('exam' in lower_cat or 'exam' in lower_file or 'cntrl' in lower_file or 
        'ctrl' in lower_file or 'ratt' in lower_file or 'ds' in lower_file or 'contrôle' in lower_file or 'controle' in lower_file):
        return "Examens", "📄 Examens"
        
    if ('td' in lower_cat or 'td' in lower_file or 'exo' in lower_file or 
        'exercice' in lower_file or 'exer' in lower_file or 'devoir' in lower_file or 'dl_' in lower_file):
        return "TD", "📝 Exercices / TD"
        
    if ('tp' in lower_cat or 'tp' in lower_file or re.search(r'\btp\b', lower_file)):
        return "TP", "💻 TP"
        
    if ('cours' in lower_cat or 'cours' in lower_file or 'chapitre' in lower_file or 
        'chap' in lower_file or 'polycopi' in lower_file or 'livre' in lower_file):
        return "Cours", "📚 Cours"
        
    if ('projet' in lower_cat or 'presentation' in lower_cat or 'expos' in lower_file or 'projet' in lower_file or 'rapport' in lower_file or 'estimation' in lower_file or 'budget' in lower_file):
        return "Projets", "🎯 Projets & Exposés"
        
    return "Autres", "📁 Autres documents"

def get_file_type(filename):
    ext = os.path.splitext(filename)[1].lower().replace('.', '')
    if ext in ['pdf']:
        return 'pdf'
    elif ext in ['doc', 'docx']:
        return 'word'
    elif ext in ['ppt', 'pptx']:
        return 'powerpoint'
    elif ext in ['xls', 'xlsx']:
        return 'excel'
    elif ext in ['jpg', 'jpeg', 'png', 'gif', 'webp', 'bmp']:
        return 'image'
    elif ext in ['zip', 'rar', '7z', 'tar', 'gz']:
        return 'archive'
    elif ext in ['txt', 'md', 'tex', 'sql']:
        return 'text'
    else:
        return 'other'

def clean_filename(name):
    name = re.sub(r'[<>:"/\\|?*]', '_', name)
    return name.strip()

# THE EXACT 7 S5 MODULES FROM THE TIMETABLE
ALLOWED_MODULES = {
    "Ponts & ouvrages d'art": {
        "professor": "Prof. F. ELABASSI",
        "schedule": "Lundi • 14h30 - 18h45 (Salle GC3)",
        "icon": "Milestone",
        "description": "Conception, calcul des tabliers, appareils d'appui, précontrainte et ponts mixtes.",
        "color": "from-emerald-500 to-teal-600",
        "accent": "text-emerald-500",
        "bgLight": "bg-emerald-50 dark:bg-emerald-950/40",
        "borderLight": "border-emerald-200 dark:border-emerald-800/50"
    },
    "Dynamiques des structures et Etude parasismique": {
        "professor": "Prof. S. SAKAMI",
        "schedule": "Mardi • 08h30 - 12h45 (Salle GC3)",
        "icon": "Activity",
        "description": "Systèmes SDOF/MDOF, spectres de réponse, vulnérabilité sismique et réglementation RPS 2000.",
        "color": "from-rose-500 to-orange-600",
        "accent": "text-rose-500",
        "bgLight": "bg-rose-50 dark:bg-rose-950/40",
        "borderLight": "border-rose-200 dark:border-rose-800/50"
    },
    "Ouvrages géotechniques": {
        "professor": "Prof. S. CHERIF",
        "schedule": "Mardi • 14h30 - 18h45 (Salle GC3)",
        "icon": "Layers",
        "description": "Fondations profondes, soutènements, stabilité des pentes, mécanique des sols et géotechnique appliquée.",
        "color": "from-amber-500 to-yellow-600",
        "accent": "text-amber-500",
        "bgLight": "bg-amber-50 dark:bg-amber-950/40",
        "borderLight": "border-amber-200 dark:border-amber-800/50"
    },
    "Construction métallique": {
        "professor": "Prof. R. Bouferra",
        "schedule": "Mercredi • 08h30 - 12h45 (Salle GC3)",
        "icon": "Grid",
        "description": "Calcul et dimensionnement des charpentes métalliques, profilés, assemblages et Eurocode 3.",
        "color": "from-blue-500 to-indigo-600",
        "accent": "text-blue-500",
        "bgLight": "bg-blue-50 dark:bg-blue-950/40",
        "borderLight": "border-blue-200 dark:border-blue-800/50"
    },
    "Innovation et simulation de jeu d'entreprise": {
        "professor": "Prof. Ghatay Khadija",
        "schedule": "Mercredi • 14h30 - 18h45 (Salle ??)",
        "icon": "Sparkles",
        "description": "Management stratégique, simulation de gestion d'entreprise, entrepreneuriat et innovation.",
        "color": "from-purple-500 to-pink-600",
        "accent": "text-purple-500",
        "bgLight": "bg-purple-50 dark:bg-purple-950/40",
        "borderLight": "border-purple-200 dark:border-purple-800/50"
    },
    "Projets et marchés publics": {
        "professor": "Prof. F. ELABASSI",
        "schedule": "Jeudi • 14h30 - 18h45 (Salle GC3)",
        "icon": "Building2",
        "description": "Gestion de projet, marchés publics au Maroc, CCAG-EMO, passation, métrés et estimation des coûts.",
        "color": "from-orange-500 to-amber-600",
        "accent": "text-orange-500",
        "bgLight": "bg-orange-50 dark:bg-orange-950/40",
        "borderLight": "border-orange-200 dark:border-orange-800/50"
    },
    "Langues et techniques d'Expression Anglais LTC3": {
        "professor": "Professeur LTC3",
        "schedule": "Vendredi • 08h30 - 12h45",
        "icon": "Compass",
        "description": "Communication technique en anglais pour ingénieurs, rédaction professionnelle et présentations orales.",
        "color": "from-cyan-500 to-blue-600",
        "accent": "text-cyan-500",
        "bgLight": "bg-cyan-50 dark:bg-cyan-950/40",
        "borderLight": "border-cyan-200 dark:border-cyan-800/50"
    }
}

def sync_all():
    print("Starting synchronization for official S5 Timetable modules...")
    
    modules_data = {}
    all_files_list = []
    file_id = 1

    # Initialize all 7 modules
    for mod_name, meta in ALLOWED_MODULES.items():
        modules_data[mod_name] = {
            "id": slugify(mod_name),
            "slug": slugify(mod_name),
            "name": mod_name,
            "professor": meta["professor"],
            "schedule": meta["schedule"],
            "description": meta["description"],
            "icon": meta["icon"],
            "color": meta["color"],
            "accent": meta["accent"],
            "bgLight": meta["bgLight"],
            "borderLight": meta["borderLight"],
            "totalFiles": 0,
            "categories": {
                "Cours": {"key": "Cours", "name": "📚 Cours", "count": 0, "files": []},
                "TD": {"key": "TD", "name": "📝 Exercices / TD", "count": 0, "files": []},
                "TP": {"key": "TP", "name": "💻 TP", "count": 0, "files": []},
                "Examens": {"key": "Examens", "name": "📄 Examens", "count": 0, "files": []},
                "Corriges": {"key": "Corriges", "name": "✅ Corrigés", "count": 0, "files": []},
                "Projets": {"key": "Projets", "name": "🎯 Projets & Exposés", "count": 0, "files": []},
                "Autres": {"key": "Autres", "name": "📁 Autres documents", "count": 0, "files": []}
            },
            "files": []
        }
        # Create standard folders
        for cat in ["Cours", "TD", "TP", "Examens", "Corriges", "Projets", "Autres"]:
            os.makedirs(os.path.join(PUBLIC_RESOURCES, mod_name, cat), exist_ok=True)

    # 1. Extract from ZIP files for Ponts, Dynamique, Geotechnique
    for zip_path in ZIPS:
        if not os.path.exists(zip_path):
            continue
        print(f"Reading {zip_path}...")
        with zipfile.ZipFile(zip_path, 'r') as z:
            for info in z.infolist():
                if info.is_dir():
                    continue
                filename = info.filename
                try:
                    raw = filename.encode('cp437')
                    decoded = raw.decode('utf-8')
                except Exception:
                    decoded = filename
                    
                parts = decoded.replace('\\', '/').split('/')
                if parts[0] == 'GC':
                    parts = parts[1:]
                    
                if len(parts) < 2:
                    continue
                    
                raw_mod = parts[0]
                orig_cat = parts[1] if len(parts) > 2 else "Autres"
                raw_file_name = "/".join(parts[2:]) if len(parts) > 2 else parts[1]
                
                # Match only to allowed modules
                target_module = None
                if "Ponts" in raw_mod:
                    target_module = "Ponts & ouvrages d'art"
                elif "Dynamique" in raw_mod:
                    target_module = "Dynamiques des structures et Etude parasismique"
                elif "Géo" in raw_mod or "Geo" in raw_mod:
                    target_module = "Ouvrages géotechniques"
                else:
                    # Ignore all other modules (Calcul des structures 2, PGC, Tech Bat, Eau, Routes)
                    continue
                    
                name_only = clean_filename(os.path.basename(raw_file_name))
                cat_folder, cat_display = classify_file(target_module, orig_cat, name_only)
                
                target_dir = os.path.join(PUBLIC_RESOURCES, target_module, cat_folder)
                os.makedirs(target_dir, exist_ok=True)
                target_file_path = os.path.join(target_dir, name_only)
                
                try:
                    with z.open(info) as src, open(target_file_path, 'wb') as dst:
                        shutil.copyfileobj(src, dst)
                except Exception as e:
                    print(f"Error extracting {name_only}: {e}")
                    continue
                    
                file_size = os.path.getsize(target_file_path)
                file_type = get_file_type(name_only)
                ext = os.path.splitext(name_only)[1].lower().replace('.', '')
                url_path = f"/resources/{target_module}/{cat_folder}/{name_only}"
                
                doc_obj = {
                    "id": f"doc-{file_id}",
                    "name": name_only,
                    "module": target_module,
                    "categoryKey": cat_folder,
                    "categoryDisplay": cat_display,
                    "size": file_size,
                    "sizeFormatted": f"{file_size / (1024*1024):.2f} Mo" if file_size >= 1024*1024 else f"{file_size / 1024:.1f} Ko",
                    "extension": ext,
                    "type": file_type,
                    "url": url_path,
                }
                all_files_list.append(doc_obj)
                
                mod_ref = modules_data[target_module]
                mod_ref["totalFiles"] += 1
                mod_ref["files"].append(doc_obj)
                mod_ref["categories"][cat_folder]["count"] += 1
                mod_ref["categories"][cat_folder]["files"].append(doc_obj)
                file_id += 1

    # 2. Add local files for "Projets et marchés publics" from S:\FST\projet management if present
    mgmt_dir = r"S:\FST\projet management"
    if os.path.exists(mgmt_dir):
        print(f"Copying project management files to 'Projets et marchés publics'...")
        for root, dirs, files in os.walk(mgmt_dir):
            for f in files:
                if f.startswith('~') or f.endswith('.tmp'):
                    continue
                src_path = os.path.join(root, f)
                name_only = clean_filename(f)
                cat_folder, cat_display = classify_file("Projets et marchés publics", "Projets", name_only)
                target_dir = os.path.join(PUBLIC_RESOURCES, "Projets et marchés publics", cat_folder)
                os.makedirs(target_dir, exist_ok=True)
                target_file_path = os.path.join(target_dir, name_only)
                shutil.copy2(src_path, target_file_path)
                
                file_size = os.path.getsize(target_file_path)
                file_type = get_file_type(name_only)
                ext = os.path.splitext(name_only)[1].lower().replace('.', '')
                url_path = f"/resources/Projets et marchés publics/{cat_folder}/{name_only}"
                
                doc_obj = {
                    "id": f"doc-{file_id}",
                    "name": name_only,
                    "module": "Projets et marchés publics",
                    "categoryKey": cat_folder,
                    "categoryDisplay": cat_display,
                    "size": file_size,
                    "sizeFormatted": f"{file_size / (1024*1024):.2f} Mo" if file_size >= 1024*1024 else f"{file_size / 1024:.1f} Ko",
                    "extension": ext,
                    "type": file_type,
                    "url": url_path,
                }
                all_files_list.append(doc_obj)
                
                mod_ref = modules_data["Projets et marchés publics"]
                mod_ref["totalFiles"] += 1
                mod_ref["files"].append(doc_obj)
                mod_ref["categories"][cat_folder]["count"] += 1
                mod_ref["categories"][cat_folder]["files"].append(doc_obj)
                file_id += 1

    # Convert to structured module list
    module_list = []
    # Preserve official order of the timetable (Lundi -> Vendredi)
    ordered_names = [
        "Ponts & ouvrages d'art",
        "Dynamiques des structures et Etude parasismique",
        "Ouvrages géotechniques",
        "Construction métallique",
        "Innovation et simulation de jeu d'entreprise",
        "Projets et marchés publics",
        "Langues et techniques d'Expression Anglais LTC3"
    ]
    
    for mod_name in ordered_names:
        m = modules_data[mod_name]
        # Only keep categories that have files or standard ones
        active_cats = [c for c in m["categories"].values() if c["count"] > 0]
        if not active_cats:
            # Show empty categories template
            active_cats = [
                {"key": "Cours", "name": "📚 Cours", "count": 0, "files": []},
                {"key": "TD", "name": "📝 Exercices / TD", "count": 0, "files": []},
                {"key": "Examens", "name": "📄 Examens", "count": 0, "files": []}
            ]
        m["categoriesList"] = active_cats
        module_list.append(m)

    final_dataset = {
        "metadata": {
            "title": "Bibliothèque Numérique S5 - Génie Civil",
            "semester": "S5",
            "totalModules": len(module_list),
            "totalDocuments": len(all_files_list),
            "generatedAt": "2026-09-18"
        },
        "modules": module_list,
        "allFiles": all_files_list
    }

    json_path = os.path.join(DATA_DIR, "resources.json")
    with open(json_path, "w", encoding="utf-8") as f:
        json.dump(final_dataset, f, indent=2, ensure_ascii=False)

    print(f"\nOfficial S5 sync finished successfully!")
    print(f"Modules retained: {len(module_list)}")
    print(f"Total documents: {len(all_files_list)}")
    for m in module_list:
        print(f"  • {m['name']} ({m['totalFiles']} docs) — {m['professor']} [{m['schedule']}]")

if __name__ == "__main__":
    sync_all()
