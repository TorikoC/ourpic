const imageInput = document.getElementById('image');
const uploadButton = document.getElementsByClassName('upload__button')[0];
const uploadIconCloud = document.getElementsByClassName(
  'upload__icon--waiting'
)[0];
const uploadIconSpinner = document.getElementsByClassName(
  'upload__icon--uploading'
)[0];

let uploading = false;
const validTypes = [
  'image/gif',
  'image/jpeg',
  'image/png',
  'image/svg+xml',
  'image/x-icon',
  'image/vnd.microsoft.icon'
];

function selectNodeText(node) {
  if (document.body.createTextRange) {
    const range = document.body.createTextRange();
    range.moveToElementText(node);
    range.select();
  } else if (window.getSelection) {
    const selection = window.getSelection();
    const range = document.createRange();
    range.selectNodeContents(node);
    selection.removeAllRanges();
    selection.addRange(range);
  } else {
    console.warn('Could not select text in node: Unsupported browser.');
  }
}
function checkFileType(file) {
  if (!file) {
    return false;
  }
  return validTypes.indexOf(file.type) !== -1;
}

imageInput.onchange = evt => {
  if (uploading) {
    return;
  }
  if (!evt.target.files) {
    return;
  }
  const isValidImage = checkFileType(evt.target.files[0]);
  if (!isValidImage) {
    swal('无法识别的图片类型', '请重新上传', 'error');
    return;
  }

  const formData = new FormData();
  formData.append('image', image.files[0]);

  // disable file input visually
  uploadButton.classList.add('upload__button--disabled');
  uploadIconCloud.style.display = 'none';
  uploadIconSpinner.style.display = 'inline-block';

  // disable file input actually
  imageInput.setAttribute('disabled', true);
  uploading = true;

  axios
    .post('/api/images', formData)
    .then(resp => {
      alert(resp);
      uploadButton.classList.remove('upload__button--disabled');
      uploadIconSpinner.style.display = 'none';
      uploadIconCloud.style.display = 'inline-block';
      imageInput.removeAttribute('disabled');
      uploading = false;
    })
    .catch(error => {
      uploadButton.classList.remove('upload__button--disabled');
      uploadIconSpinner.style.display = 'none';
      uploadIconCloud.style.display = 'inline-block';
      imageInput.removeAttribute('disabled');
      uploading = false;
    });
};

function alert(resp) {
  const wrapper = document.createElement('div');

  const row1 = document.createElement('div');
  const link = document.createElement('a');
  const copyButton = document.createElement('button');

  const row2 = document.createElement('div');
  const label = document.createElement('label');
  label.innerHTML = '选择托管时间: ';
  const selection = document.createElement('select');
  const options = [
    {
      name: '1分钟',
      value: 60 * 1000
    },
    {
      name: '5分钟',
      value: 60 * 1000 * 5
    },
    {
      name: '10分钟',
      value: 60 * 1000 * 10
    },
    {
      name: '30分钟',
      value: 60 * 1000 * 30
    },
    {
      name: '1小时',
      value: 60 * 1000 * 60
    },
    {
      name: '12小时',
      value: 60 * 1000 * 60 * 12
    },
    {
      name: '24小时',
      value: 60 * 1000 * 60 * 24
    }
  ];
  for (let option of options) {
    let op = document.createElement('option');
    op.innerHTML = option.name;
    op.value = option.value;
    selection.appendChild(op);
  }

  copyButton.classList.add('copy-button');
  copyButton.innerHTML = '复制';

  tippy(copyButton, {
    content: 'copied!',
    arrow: true,
    arrowType: 'round',
    animation: 'fade',
    trigger: 'manual',
    zIndex: 99999 // should higher then sweetalert modal.
  });

  copyButton.addEventListener(
    'click',
    event => {
      selectNodeText(link);
      document.execCommand('copy');
    },
    false
  );

  link.href = resp.data;
  link.innerHTML = resp.data;
  link.setAttribute('target', '_blank');

  link.addEventListener('copy', event => {
    event.preventDefault();
    if (event.clipboardData) {
      event.clipboardData.setData('text/plain', link.textContent);
      copyButton._tippy.show();
    }
    if (window.getSelection) {
      if (window.getSelection().empty) {
        // Chrome
        window.getSelection().empty();
      } else if (window.getSelection().removeAllRanges) {
        // Firefox
        window.getSelection().removeAllRanges();
      }
    } else if (document.selection) {
      // IE?
      document.selection.empty();
    }
    setTimeout(() => {
      copyButton._tippy.hide();
    }, 1000);
  });

  row1.innerText = '图片地址: ';
  row1.appendChild(link);
  row1.appendChild(copyButton);

  row2.appendChild(label);
  row2.appendChild(selection);

  wrapper.appendChild(row1);
  wrapper.appendChild(row2);

  swal({
    title: '上传成功',
    icon: 'success',
    content: wrapper
  }).then(() => {
    const selection = wrapper.querySelector('select');
    const formData = new FormData();
    formData.append('age', selection.value);
    const name = resp.data.split('/').pop();
    axios
      .put(`/api/images/${name}`, formData)
      .then(resp => {})
      .catch(error => {});
  });
}
