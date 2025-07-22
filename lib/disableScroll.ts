let scrollPosition = 0;

export const disableScroll = () => {
  const el = document.querySelector("body > div.flex.h-full") as HTMLElement;
  if (!el) return;

  scrollPosition = window.scrollY;

  el.style.position = 'fixed';
  el.style.top = `-${scrollPosition}px`;
  el.style.left = '0';
  el.style.right = '0';
  el.style.overflow = 'hidden';
  el.style.width = '100%';
};

export const enableScroll = () => {
  const el = document.querySelector("body > div.flex.h-full") as HTMLElement;
  if (!el) return;

  el.style.position = '';
  el.style.top = '';
  el.style.left = '';
  el.style.right = '';
  el.style.overflow = '';
  el.style.width = '';

  window.scrollTo(0, scrollPosition);
};
