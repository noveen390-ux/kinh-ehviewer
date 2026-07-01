const tagDict: Record<string, string> = {
  'big breasts': 'ثدي كبير', 'big ass': 'مؤخرة كبيرة',
  'sole female': 'أنثى وحيدة', 'sole male': 'ذكر وحيد',
  'blowjob': 'مص', 'nakadashi': 'قذف داخلي', 'paizuri': 'بايزوري',
  'stockings': 'جوارب', 'schoolgirl uniform': 'زي تلميذة',
  'ahegao': 'أهيغاو', 'anal': 'شرج', 'bondage': 'ربط',
  'bikini': 'بيكيني', 'gloves': 'قفازات', 'collar': 'طوق',
  'dark skin': 'بشرة سمراء', 'futanari': 'فتاناري',
  'females only': 'إناث فقط', 'males only': 'ذكور فقط',
  'full color': 'ملون', 'sex toys': 'ألعاب جنسية',
  'ponytail': 'ذيل حصان', 'big penis': 'قضيب كبير',
  'mosaic censorship': 'تعتيم', 'uncensored': 'بدون حجب',
  'catgirl': 'فتاة قط', 'kemonomimi': 'كيمونوميمي',
  'tail': 'ذيل', 'fox girl': 'فتاة ثعلب', 'elf': 'قزم',
  'halo': 'هالة', 'wings': 'أجنحة', 'maid': 'خادمة',
  'nurse': 'ممرضة', 'swimsuit': 'لبس سباحة',
  'lingerie': 'ملابس داخلية', 'pantyhose': 'جوارب',
  'sweating': 'تعرق', 'masturbation': 'استمناء',
  'handjob': 'استمناء يدوي', 'cunnilingus': 'لعق',
  'fingering': 'مداعبة', 'corruption': 'فساد',
  'mind break': 'انهيار', 'impregnation': 'إخصاب',
  'pregnant': 'حامل', 'lolicon': 'لوليكون', 'shotacon': 'شوتاكون',
  'netorare': 'نيتراري', 'group': 'جماعي', 'tentacles': 'مخالب',
  'bunny girl': 'فتاة أرنب', 'glasses': 'نظارات',
  'chinese': 'صيني', 'english': 'إنجليزي', 'japanese': 'ياباني',
  'korean': 'كوري', 'translated': 'مترجم', 'original': 'أصلي',
  'western': 'غربي', 'misc': 'متنوع', 'cosplay': 'كوسبلاي',
  'parody': 'محاكاة', 'character': 'شخصية', 'artist': 'فنان',
  'female': 'أنثى', 'male': 'ذكر', 'language': 'لغة',
  'mixed': 'مختلط', 'other': 'أخرى', 'ai generated': 'ذكاء اصطناعي',
  'furry': 'فروي', 'yaoi': 'ياوي', 'yuri': 'يوري',
  'incomplete': 'غير مكتمل', 'sample': 'عينة',
  'monochrome': 'أبيض وأسود', 'digital': 'رقمي',
  'doujinshi': 'دوجينشي', 'manga': 'مانجا',
  'game cg': 'CG لعبة', 'image set': 'مجموعة صور',
  'artist cg': 'CG فنان', 'non-h': 'غير جنسي',
  'asian porn': 'إباحي آسيوي',
}

const catDict: Record<string, string> = {
  'Doujinshi': 'دوجينشي', 'Manga': 'مانجا',
  'Artist CG': 'CG فنان', 'Game CG': 'CG لعبة',
  'Western': 'غربي', 'Non-H': 'غير جنسي',
  'Image Set': 'مجموعة صور', 'Cosplay': 'كوسبلاي',
  'Asian Porn': 'إباحي آسيوي', 'Misc': 'متنوع',
}

export function translateTag(tag: string): string {
  return tagDict[tag.toLowerCase()] || tag
}

export function translateCategory(cat: string): string {
  return catDict[cat] || cat
}
