import { GoogleGenerativeAI } from "@google/generative-ai";

async function generateDescription(projectTitle) {
    const genAI = new GoogleGenerativeAI("AIzaSyAHw2aODGIUELsuMiyZMHDTL0lMRFqof_U");
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    // const model = genAI.getGenerativeModel({
    //     model: "gemini-1.5-flash",
    //     generationConfig: {
    //         candidateCount: 1,
    //         stopSequences: ["x"],
    //         maxOutputTokens: 150,
    //         temperature: 0.7,
    //     },
    // });

    // const prompt = `Write a compelling project description for a freelance job titled: "${projectTitle}". The description should attract skilled freelancers to bid on the project by providing an overview of requirements and expectations.`;
    const prompt = `Write a compelling project description for a freelance job titled: "${projectTitle}". The description should attract skilled freelancers to bid on the project by providing an overview of requirements and expectations. Please make the description concise containing maximum 100 words long.`;


    try {
        const result = await model.generateContent(prompt);
        let description = result.response.text().trim();

        // Clean the description by removing markdown and unnecessary symbols
        description = description
            .replace(/#{1,3}\s*/g, '')          // Removes single '#', '##', '###' at the start of lines
            .replace(/\*\*(.*?)\*\*/g, '$1')    // Removes '**' bold markdown, keeping inner text
            .replace(/^\*\s*/gm, '')            // Removes single '*' used as bullet points
            .trim();                            // Trims any residual whitespace

        console.log(description);
        return { success: true, description };

    } catch (error) {
        let errorMessage = "An error occurred while generating the description.";

        if (error.response) {
            console.error("Content blocked or another safety error:", error.response);
            errorMessage = "Content blocked due to safety filters. Please try a different title.";
        } else {
            console.error("Error generating description:", error);
        }

        return { success: false, message: errorMessage };
    }
}

export default generateDescription;
