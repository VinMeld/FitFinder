const axios = require('axios');

export async function isToxic(text) {
    const API_TOKEN = process.env.HUGGING_FACE_API_KEY
    const MODEL = 'SkolkovoInstitute/roberta_toxicity_classifier';
    const API_URL = `https://api-inference.huggingface.co/models/${MODEL}`;
    try {
        const response = await axios.post(
            API_URL,
            { inputs: text, options: { wait_for_model: true }},
            { headers: { Authorization: `Bearer ${API_TOKEN}` } },
        );

        const data = response.data[0];
        console.log(data)
        if (Array.isArray(data) && 'label' in data[0] && 'score' in data[0]) {
            return data[0].label === 'toxic' && data[0].score >= 0.70;
        }
    } catch (error) {
        console.error(`Request failed with status code ${error.response.status}`);
    }

    return false;
}

// Usage
// isToxic('you are amazing').then(isToxic => console.log(isToxic ? 'Toxic' : 'Not toxic'));
