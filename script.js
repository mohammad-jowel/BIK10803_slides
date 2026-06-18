
const slides = Array.from(document.querySelectorAll('.slide'));
const deck = document.getElementById('deck');
const progressBar = document.getElementById('progressBar');
const counter = document.getElementById('counter');
const notesPanel = document.getElementById('notesPanel');
const notesText = document.getElementById('notesText');
let current = 0;

function showSlide(index){
  if(index < 0) index = 0;
  if(index >= slides.length) index = slides.length - 1;

  const previous = current;
  const direction = index >= previous ? 'next' : 'prev';
  const previousSlide = slides[previous];

  current = index;
  deck.classList.remove('moving-next','moving-prev');
  void deck.offsetWidth; // restart CSS animations cleanly
  deck.classList.add(direction === 'next' ? 'moving-next' : 'moving-prev');

  slides.forEach((slide, i)=>{
    slide.classList.remove('active','exiting');
    if(i === previous && i !== current) slide.classList.add('exiting');
    if(i === current) slide.classList.add('active');
  });

  window.setTimeout(()=>{
    previousSlide?.classList.remove('exiting');
  }, 480);

  counter.textContent = `${String(current + 1).padStart(2,'0')} / ${String(slides.length).padStart(2,'0')}`;
  progressBar.style.width = `${((current + 1) / slides.length) * 100}%`;
  notesText.textContent = slides[current].dataset.notes || 'No notes for this slide.';
  location.hash = `slide-${current + 1}`;
}
function nextSlide(){ showSlide(current + 1); }
function prevSlide(){ showSlide(current - 1); }
function homeSlide(){ showSlide(0); }
function toggleNotes(){
  notesPanel.classList.toggle('open');
  notesPanel.setAttribute('aria-hidden', notesPanel.classList.contains('open') ? 'false' : 'true');
}

document.getElementById('nextBtn').addEventListener('click', nextSlide);
document.getElementById('prevBtn').addEventListener('click', prevSlide);
document.getElementById('homeBtn').addEventListener('click', homeSlide);
document.getElementById('notesBtn').addEventListener('click', toggleNotes);
document.getElementById('closeNotes').addEventListener('click', toggleNotes);

document.addEventListener('keydown', (event)=>{
  const key = event.key.toLowerCase();
  if(['arrowright','pagedown',' '].includes(key)){ event.preventDefault(); nextSlide(); }
  if(['arrowleft','pageup','backspace'].includes(key)){ event.preventDefault(); prevSlide(); }
  if(key === 'home'){ event.preventDefault(); homeSlide(); }
  if(key === 'n'){ event.preventDefault(); toggleNotes(); }
  if(key === 'f'){ document.documentElement.requestFullscreen?.(); }
});

// Deep-link support: index.html#slide-12
const match = location.hash.match(/slide-(\d+)/i);
if(match){ showSlide(Number(match[1]) - 1); } else { showSlide(0); }

// Keep diagram placeholders friendly when an asset is replaced later.
document.querySelectorAll('.diagram-frame img').forEach(img => {
  img.addEventListener('load', () => img.parentElement.classList.remove('missing'));
});
