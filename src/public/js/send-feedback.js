var sending = false;
const contactButton = document.getElementsByClassName('contact__button')[0];
const spinner = document.createElement('img');
const form = document.getElementsByClassName('contact__form')[0];

form.addEventListener('submit', evt => {
  evt.preventDefault();
  sendFeedback(evt.target);
  return false;
});
spinner.src = '../images/spinner-solid.svg';
spinner.alt = 'spinner-solid';

function resetForm(form) {
  if (!form) {
    return;
  }
  form.reset();
}

function sendFeedback(form) {
  if (sending) {
    return;
  }
  if (!form) {
    return;
  }
  sending = true;
  contactButton.setAttribute('disabled', true);
  contactButton.classList.add('contact__button--disabled');
  contactButton.innerHTML = '';
  contactButton.appendChild(spinner);
  const formData = new FormData(form);
  axios
    .post('/api/feedbacks', formData)
    .then(() => {
      swal({
        title: '发送成功',
        text: '感谢你的反馈',
        icon: 'success'
      });
      sending = false;
      contactButton.removeAttribute('disabled');
      contactButton.classList.remove('contact__button--disabled');
      contactButton.removeChild(spinner);
      contactButton.innerHTML = '提交';
      form.reset();
    })
    .catch(() => {
      sending = false;
      contactButton.removeAttribute('disabled');
      contactButton.classList.remove('contact__button--disabled');
      contactButton.removeChild(spinner);
      contactButton.innerHTML = '提交';
      swal({
        title: '发送失败',
        text: error.message,
        icon: 'error'
      });
    });
  return false;
}
