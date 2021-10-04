export const showNotification = (title, options) => {
  Notification.requestPermission().then(result => {
    if (document.hasFocus()) return
    if (result !== 'granted') return
    const notification = new Notification(title, options);
    notification.onclick = (e) => {
      e.preventDefault()
      window.focus();
    }
   });
}