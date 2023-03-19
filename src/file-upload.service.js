import axios from 'axios';

const BASE_URL = 'http://80.87.197.127:8000';

function upload(formData, modelNumber) {
    const model  = modelNumber == 'first' ? '/image_first' : '/image_second'
    const url = `${BASE_URL}${model}`;

    return axios.post(url, formData)
        // get data
        .then(x => x.data)
        .then(x => JSON.parse(x))
        // add url field
}

export { upload }