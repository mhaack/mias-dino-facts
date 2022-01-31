---
pagination:
  data: collections
  size: 1
  alias: selectedTag
permalink: /tags/{{ selectedTag | noEmoji | slug }}/
layout: layouts/dino-list.njk
allDinosLabel: Alle Dinos
icon: /img/icons/dinosaurier.png
eleventyComputed:
  metaTitle: "{{ selectedTag | noEmoji }}"
---
