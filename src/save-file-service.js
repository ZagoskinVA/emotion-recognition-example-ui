import axios from 'axios';

const BASE_URL = 'https://80.87.197.127:5001/Photo';



function saveFileToDb(formData) {
    const url = `${BASE_URL}`;
    return axios.post(url, formData)
        // get data
        .then(x => x.data)
    // add url field
}


export {
    saveFileToDb
}