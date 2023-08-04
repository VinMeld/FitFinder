const API_TOKEN = process.env.HUGGING_FACE_API_KEY
import  { categories } from "../../../../public/index"

interface LabelScore {
    label: string;
    score: number;
}

export async function zeroShotClassification(sequence_to_classify: string): Promise<string[]> {
    const candidate_labels = categories;
    if (!candidate_labels) {
        throw new Error("Candidate labels is undefined");
    }
    console.log("Candidate labels:", candidate_labels);
    const requestBody = {
        inputs: sequence_to_classify,
        parameters: {candidate_labels: candidate_labels},
        multi_label: false,
        options: {wait_for_model: true}
    };
    console.log("Request body:", requestBody);
    const response = await fetch(
        "https://api-inference.huggingface.co/models/MoritzLaurer/DeBERTa-v3-large-mnli-fever-anli-ling-wanli",
        {
            headers: { Authorization: `Bearer ${API_TOKEN}` },
            method: "POST",
            body: JSON.stringify(requestBody),
        }
    );
    const result = await response.json();
    console.log(result);
    if (result.error) {
        throw new Error(result.error);
    }
    const label_scores: LabelScore[] = result.labels.map((label: string, index: number) => {
        return {label: label, score: result.scores[index]}
    });

    label_scores.sort((a, b) => b.score - a.score);
    return label_scores.slice(0, 3).map(label_score => label_score.label);
}
