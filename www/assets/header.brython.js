__BRYTHON__.use_VFS = true;
var scripts = {"$timestamp": 1578484332042, "header": [".py", "from browser import window,document as doc\nfrom browser.html import *\n\ntrans_menu={\n\"menu_console\":{\"en\":\"Console\",\"es\":\"Consola\",\"fr\":\"Console\"},\n\"menu_editor\":{\"en\":\"Editor\",\"es\":\"Editor\",\"fr\":\"Editeur\"},\n\"menu_demo\":{\"en\":\"Demo\",\"es\":\"Demo\",\"fr\":\"D\u00e9mo\"},\n\"menu_gallery\":{\"en\":\"Gallery\",\"es\":\"Galer\u00eda\",\"fr\":\"Galerie\"},\n\"menu_doc\":{\"en\":\"Documentation\",\"es\":\"Documentaci\u00f3n\",\"fr\":\"Documentation\"},\n\"menu_download\":{\"en\":\"Download\",\"es\":\"Descargas\",\"fr\":\"T\u00e9l\u00e9chargement\"},\n\"menu_dev\":{\"en\":\"Development\",\"es\":\"Desarrollo\",\"fr\":\"D\u00e9veloppement\"},\n\"menu_groups\":{\"en\":\"Community\",\"es\":\"Comunidad\",\"fr\":\"Communaut\u00e9\"},\n\"menu_tutorial\":{\"en\":\"Tutorial\",\"es\":\"Tutorial\",\"fr\":\"Tutoriel\"}\n}\nlinks={\n\"home\":\"index.html\",\n\"console\":\"tests/console.html\",\n\"demo\":\"demo.html\",\n\"editor\":\"tests/editor.html\",\n\"gallery\":\"gallery/gallery_{language}.html\",\n\"doc\":\"static_doc/{language}/intro.html\",\n\"download\":\"https://github.com/brython-dev/brython/releases\",\n\"dev\":\"https://github.com/brython-dev/brython\",\n\"groups\":\"groups.html\",\n\"tutorial\":\"static_tutorial/{language}/index.html\"\n}\n\ndef show(language=None ):\n ''\n \n has_req=False\n qs_lang=None\n \n prefix=\"/\"\n \n if language is None :\n  qs_lang=doc.query.getfirst(\"lang\")\n  if qs_lang and qs_lang in [\"en\",\"fr\",\"es\"]:\n   has_req=True\n   language=qs_lang\n  else :\n   lang=__BRYTHON__.language\n   if lang in [\"en\",\"fr\",\"es\"]:\n    language=lang\n    \n language=language or \"en\"\n \n _banner=doc[\"banner_row\"]\n \n loc=window.location.href\n current=None\n for key in [\"home\",\"console\",\"demo\",\"editor\",\"groups\"]:\n  if links[key]in loc:\n   current=key\n   break\n   \n if current is None :\n  if \"gallery\"in loc:\n   current=\"gallery\"\n  elif \"static_doc\"in loc:\n   current=\"doc\"\n   \n for key in [\"tutorial\",\"demo\",\"doc\",\"console\",\"editor\",\"gallery\",\n \"download\",\"dev\",\"groups\"]:\n  if key in [\"download\",\"dev\"]:\n   href=links[key]\n  else :\n   href=prefix+links[key]\n  if key in [\"doc\",\"tutorial\",\"gallery\"]:\n   href=href.format(language=language)\n  if key not in [\"download\",\"dev\"]:\n  \n   href +=f\"?lang={language}\"\n  print(key,href)\n  if key ==\"home\":\n   img=IMG(src=\"/brython.svg\",Class=\"logo\")\n   link=A(img,href=href)\n   cell=TD(link,Class=\"logo\")\n  else :\n   link=A(trans_menu[f\"menu_{key}\"][language],href=href,\n   Class=\"banner\")\n   cell=TD(link)\n   if key ==current:\n    link.classList.add(\"selected_header\")\n  if key in [\"download\",\"dev\"]:\n   link.attrs[\"target\"]=\"_blank\"\n  _banner <=cell\n  \n return qs_lang,language\n", ["browser", "browser.html"]]}
__BRYTHON__.update_VFS(scripts)
