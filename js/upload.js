const uploadPreview = document.querySelector('#upload-preview');
const uploadBox = document.querySelector('#upload-box');
const fileUpload = document.querySelector('#file-upload');
const image = document.querySelector('#image');
const faceResult = document.querySelector('#face-result');

fileUpload.onchange = (evt) => {
  const [file] = fileUpload.files;
  if (file) {
    image.src = URL.createObjectURL(file);
    uploadPreview.classList.remove('d-none');
    uploadBox.classList.add('d-none');
    uploadFile();
  }
};

async function uploadFile() {
  const formData = new FormData();
  const [file] = fileUpload.files;
  formData.append(file.name, file);
  showLoading();
  try {
    const response = await fetch('/api/facecheck', {
      method: 'POST',
      body: formData,
    });
    const result = await response.json();
    if (result.success) {
      faceResult.innerHTML = result.name;
      faceResult.classList.remove('error');
    } else {
      faceResult.innerHTML = result.error;
      faceResult.classList.add('error');
    }
    Toastify({
      text: 'execute time: ' + result.time,
      duration: 5000,
    }).showToast();
  } catch (e) {
    console.log(e);
  }
  hideLoading();
}

uploadBox.addEventListener('click', (e) => {
  e.preventDefault();
  fileUpload.click();
});

function reset() {
  uploadPreview.classList.add('d-none');
  uploadBox.classList.remove('d-none');
  fileUpload.value = '';
}

const loading = document.querySelector('#loading');
function showLoading() {
  loading.classList.remove('d-none');
}
function hideLoading() {
  loading.classList.add('d-none');
}
