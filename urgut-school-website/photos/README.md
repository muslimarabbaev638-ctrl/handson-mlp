# Photos

Put the school's photos here and run `npm run build`. The file name (without the extension) picks
where each photo appears. JPG, PNG, WebP, AVIF and TIFF all work. Use the largest original you
have: the build resizes it to 640, 1024 and 1600 px WebP and removes EXIF data, including GPS
location.

| File name      | Where it appears                           | From the old site |
| -------------- | ------------------------------------------ | ----------------- |
| `hero.jpg`     | Home page header, and the social preview   | `IMG_1765`        |
| `students.jpg` | Home page, next to the mission             | `IMG_1767`        |
| `lab.jpg`      | About page, facilities                     | `IMG_1766`        |
| `campus.jpg`   | About page                                 | `IMG_1768` (or `IMG_1764`) |
| `classroom.jpg`| Academics page                             | —                 |

Any slot without a photo is simply left out of the layout. The alt text for each photo is in
`content/school.js` under `photos`.

Only use photos in which every student shown has agreed to appear (with a parent's consent).
Never add photos of certificates, score reports or documents that show a student's name.
