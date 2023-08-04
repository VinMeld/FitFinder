import { createClient } from "../../utils/supabase-server";
import { NextResponse } from "next/server";
import { URL } from 'url'; // Node.js built-in URL module
import axios from "axios";
const API_KEY = process.env.NSFW_API_KEY;

export async function POST(request) {
    // Extract the image from the request body
    const payload = await request.json();
    const { image_url } = payload;
    console.log("got image url")
    console.log(image_url)
    // Make sure an image was provided
    if (!image_url) {
        return new NextResponse('No image provided', { status: 400 });
    }
    const options = {
        method: 'POST',
        url: 'https://nsfw-image-classification1.p.rapidapi.com/img/nsfw',
        headers: {
            'content-type': 'application/json',
            'X-RapidAPI-Key': `${API_KEY}`,
            'X-RapidAPI-Host': 'nsfw-image-classification1.p.rapidapi.com'
        },
        data: {
            url: image_url
        }
    };

    try {
        const response = await axios.request(options);
        return new NextResponse(JSON.stringify(response.data));
    } catch (error) {
        console.error(error);
        return new NextResponse('Error processing image', { status: 500 });
    }
}
