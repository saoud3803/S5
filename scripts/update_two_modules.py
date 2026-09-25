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
JSON_CATALOG_PATH = os.path.join(DATA_DIR, "resources.json")

# Load existing catalog
with open(JSON_CATALOG_PATH, "r", encoding="utf-8") as f:
    catalog_data = json.load(f)

# The 2 targeted archives
ZIP_CM = r"C:\Users\saoud\Downloads\Construction métallique bois et mixte-20260918T201712Z-1-001.zip"
ZIP_MP = r"C:\Users\saoud\Downloads\Gestion du domaine public – Marchés publics-20260918T201822Z-1-001.zip"

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
        
    if ('tp' in lower_cat or 'tp' in lower_file or re.search(r'\btp\b', lower_file)):
        return "TP", "💻 TP"
        
    if ('td' in lower_cat or 'td' in lower_file or 'exo' in lower_file or 
        'exercice' in lower_file or 'exer' in lower_file or 'devoir' in lower_file or 'dl_' in lower_file):
        return "TD", "📝 Exercices / TD"
        
    if ('cours' in lower_cat or 'cours' in lower_file or 'chapitre' in lower_file or 
        'chap' in lower_file or 'polycopi' in lower_file or 'livre' in lower_file or 'decret' in lower_file or 'mp ' in lower_file):
        return "Cours", "📚 Cours"
        
    if ('projet' in lower_cat or 'presentation' in lower_cat or 'expos' in lower_file or 'projet' in lower_file or 'rapport' in lower_file or 'ao ' in lower_file or 'marche' in lower_file):
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
    elif ext in ['txt', 'md', 'tex', 'sql', 'rtd', 'bak']:
        return 'text'
    else:
        return 'other'

def clean_filename(name):
    name = re.sub(r'[<>:"/\\|?*]', '_', name)
    return name.strip()

def process_target_modules():
    # Module 1: Construction métallique, bois et mixte
    mod1_name = "Construction métallique, bois et mixte"
    mod1_dir = os.path.join(PUBLIC_RESOURCES, mod1_name)
    # Also clean old "Construction métallique" directory if present
    old_mod1_dir = os.path.join(PUBLIC_RESOURCES, "Construction métallique")
    if os.path.exists(old_mod1_dir):
        shutil.rmtree(old_mod1_dir)
    if os.path.exists(mod1_dir):
        shutil.rmtree(mod1_dir)
    os.makedirs(mod1_dir, exist_ok=True)
    
    # Module 2: Projets et marchés publics
    mod2_name = "Projets et marchés publics"
    mod2_dir = os.path.join(PUBLIC_RESOURCES, mod2_name)
    if os.path.exists(mod2_dir):
        shutil.rmtree(mod2_dir)
    os.makedirs(mod2_dir, exist_ok=True)
    
    mod1_files = []
    mod2_files = []
    
    # Extract CM
    print("Extracting Construction métallique, bois et mixte...")
    with zipfile.ZipFile(ZIP_CM, 'r') as z:
        for info in z.infolist():
            if info.is_dir():
                continue
            filename = info.filename
            try:
                decoded = filename.encode('cp437').decode('utf-8')
            except Exception:
                decoded = filename
            parts = decoded.replace('\\', '/').split('/')
            if len(parts) < 2:
                continue
            # parts[0] is root folder
            orig_cat = parts[1] if len(parts) > 2 else "Autres"
            raw_file_name = "/".join(parts[2:]) if len(parts) > 2 else parts[1]
            name_only = clean_filename(os.path.basename(raw_file_name))
            if not name_only:
                continue
            
            cat_folder, cat_display = classify_file(mod1_name, orig_cat, name_only)
            target_dir = os.path.join(mod1_dir, cat_folder)
            os.makedirs(target_dir, exist_ok=True)
            target_path = os.path.join(target_dir, name_only)
            
            # Avoid overwriting identical names in different subfolders by appending index if needed
            counter = 1
            base_n, ext_n = os.path.splitext(name_only)
            while os.path.exists(target_path):
                name_only = f"{base_n} ({counter}){ext_n}"
                target_path = os.path.join(target_dir, name_only)
                counter += 1
                
            try:
                with z.open(info) as src, open(target_path, 'wb') as dst:
                    shutil.copyfileobj(src, dst)
            except Exception as e:
                print(f"Error copying {name_only}: {e}")
                continue
                
            file_size = os.path.getsize(target_path)
            file_type = get_file_type(name_only)
            ext = os.path.splitext(name_only)[1].lower().replace('.', '')
            url_path = f"/resources/{mod1_name}/{cat_folder}/{name_only}"
            
            mod1_files.append({
                "id": f"cm-{len(mod1_files)+1}",
                "name": name_only,
                "module": mod1_name,
                "categoryKey": cat_folder,
                "categoryDisplay": cat_display,
                "size": file_size,
                "sizeFormatted": f"{file_size / (1024*1024):.2f} Mo" if file_size >= 1024*1024 else f"{file_size / 1024:.1f} Ko",
                "extension": ext,
                "type": file_type,
                "url": url_path,
            })

    # Extract Marchés Publics
    print("Extracting Projets et marchés publics...")
    with zipfile.ZipFile(ZIP_MP, 'r') as z:
        for info in z.infolist():
            if info.is_dir():
                continue
            filename = info.filename
            try:
                decoded = filename.encode('cp437').decode('utf-8')
            except Exception:
                decoded = filename
            parts = decoded.replace('\\', '/').split('/')
            if len(parts) < 2:
                orig_cat = "Autres"
                raw_file_name = parts[0]
            else:
                orig_cat = parts[1] if len(parts) > 2 else "Autres"
                raw_file_name = "/".join(parts[2:]) if len(parts) > 2 else parts[1]
                
            name_only = clean_filename(os.path.basename(raw_file_name))
            if not name_only:
                continue
                
            cat_folder, cat_display = classify_file(mod2_name, orig_cat, name_only)
            target_dir = os.path.join(mod2_dir, cat_folder)
            os.makedirs(target_dir, exist_ok=True)
            target_path = os.path.join(target_dir, name_only)
            
            counter = 1
            base_n, ext_n = os.path.splitext(name_only)
            while os.path.exists(target_path):
                name_only = f"{base_n} ({counter}){ext_n}"
                target_path = os.path.join(target_dir, name_only)
                counter += 1
                
            try:
                with z.open(info) as src, open(target_path, 'wb') as dst:
                    shutil.copyfileobj(src, dst)
            except Exception as e:
                print(f"Error copying {name_only}: {e}")
                continue
                
            file_size = os.path.getsize(target_path)
            file_type = get_file_type(name_only)
            ext = os.path.splitext(name_only)[1].lower().replace('.', '')
            url_path = f"/resources/{mod2_name}/{cat_folder}/{name_only}"
            
            mod2_files.append({
                "id": f"mp-{len(mod2_files)+1}",
                "name": name_only,
                "module": mod2_name,
                "categoryKey": cat_folder,
                "categoryDisplay": cat_display,
                "size": file_size,
                "sizeFormatted": f"{file_size / (1024*1024):.2f} Mo" if file_size >= 1024*1024 else f"{file_size / 1024:.1f} Ko",
                "extension": ext,
                "type": file_type,
                "url": url_path,
            })
            
    print(f"CM files extracted: {len(mod1_files)}")
    print(f"Marchés Publics files extracted: {len(mod2_files)}")
    
    # Update catalog_data without modifying the other 5 modules!
    new_modules = []
    all_files_combined = []
    
    for mod in catalog_data["modules"]:
        slug = mod["slug"]
        if slug in ["construction-metallique", "construction-metallique-bois-et-mixte"]:
            # Update Construction métallique, bois et mixte
            mod["name"] = "Construction métallique, bois et mixte"
            mod["id"] = "construction-metallique-bois-et-mixte"
            mod["slug"] = "construction-metallique-bois-et-mixte"
            mod["description"] = "Charpente métallique, constructions en bois, structures mixtes acier-béton, calcul aux Eurocodes."
            mod["totalFiles"] = len(mod1_files)
            mod["files"] = mod1_files
            
            cats = {}
            for f in mod1_files:
                ck = f["categoryKey"]
                if ck not in cats:
                    cats[ck] = {"key": ck, "name": f["categoryDisplay"], "count": 0, "files": []}
                cats[ck]["count"] += 1
                cats[ck]["files"].append(f)
            mod["categories"] = cats
            mod["categoriesList"] = list(cats.values())
            new_modules.append(mod)
            all_files_combined.extend(mod1_files)
            
        elif slug in ["projets-et-marches-publics", "gestion-du-domaine-public-marches-publics"]:
            # Update Projets et marchés publics
            mod["name"] = "Projets et marchés publics"
            mod["id"] = "projets-et-marches-publics"
            mod["slug"] = "projets-et-marches-publics"
            mod["description"] = "Gestion du domaine public, passation des marchés publics au Maroc, CCAG-EMO, appels d'offres et décrets."
            mod["totalFiles"] = len(mod2_files)
            mod["files"] = mod2_files
            
            cats = {}
            for f in mod2_files:
                ck = f["categoryKey"]
                if ck not in cats:
                    cats[ck] = {"key": ck, "name": f["categoryDisplay"], "count": 0, "files": []}
                cats[ck]["count"] += 1
                cats[ck]["files"].append(f)
            mod["categories"] = cats
            mod["categoriesList"] = list(cats.values())
            new_modules.append(mod)
            all_files_combined.extend(mod2_files)
            
        else:
            # Keep module untouched
            new_modules.append(mod)
            all_files_combined.extend(mod["files"])
            
    catalog_data["modules"] = new_modules
    catalog_data["allFiles"] = all_files_combined
    catalog_data["metadata"]["totalDocuments"] = len(all_files_combined)
    catalog_data["metadata"]["totalModules"] = len(new_modules)
    
    with open(JSON_CATALOG_PATH, "w", encoding="utf-8") as f:
        json.dump(catalog_data, f, indent=2, ensure_ascii=False)
        
    print("\nUpdated resources.json successfully!")
    print(f"Total catalog files: {len(all_files_combined)}")

process_target_modules()
