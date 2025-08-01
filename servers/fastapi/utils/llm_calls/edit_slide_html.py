import asyncio
from typing import Optional
from google.genai.types import GenerateContentConfig
from utils.llm_provider import (
    get_google_llm_client,
    get_large_model,
    is_google_selected,
    get_llm_client,
)

system_prompt = """
    You are an expert HTML slide editor. Your task is to modify slide HTML content based on user prompts while maintaining proper structure, styling, and functionality.

    Guidelines:
    1. **Preserve Structure**: Maintain the overall HTML structure, including essential containers, classes, and IDs
    2. **Content Updates**: Modify text, images, lists, and other content elements as requested
    3. **Style Consistency**: Keep existing CSS classes and styling unless specifically asked to change them
    4. **Responsive Design**: Ensure modifications work across different screen sizes
    5. **Accessibility**: Maintain proper semantic HTML and accessibility attributes
    6. **Clean Output**: Return only the modified HTML without explanations unless errors occur

    Common Edit Types:
    - Text content changes (headings, paragraphs, lists)
    - Image updates (src, alt text, captions)
    - Layout modifications (adding/removing sections)
    - Style adjustments (colors, fonts, spacing via classes)
    - Interactive elements (buttons, links, forms)

    Error Handling:
    - If the HTML structure is invalid, fix it while making requested changes
    - If a request would break functionality, suggest an alternative approach
    - For unclear prompts, make reasonable assumptions and note any ambiguities

    Output Format:
    Return the complete modified HTML. If the original HTML contains <style> or <script> tags, preserve them unless specifically asked to modify.
"""


def get_user_prompt(prompt: str, html: str):
    return f"""
        Please edit the following slide HTML based on this prompt:

        **Edit Request:** {prompt}

        **Current HTML:**
        ```html
        {html}
        ```

        Return the modified HTML with your changes applied.
    """


async def get_edited_slide_html(prompt: str, html: str):
    model = get_large_model()
    llm_response = None
    if is_google_selected():
        client = get_google_llm_client()
        response = await asyncio.to_thread(
            client.models.generate_content,
            model=model,
            contents=[get_user_prompt(prompt, html)],
            config=GenerateContentConfig(
                system_instruction=system_prompt,
                response_mime_type="text/plain",
            ),
        )
        llm_response = response.text
    else:
        client = get_llm_client()
        response = await client.chat.completions.create(
            model=model,
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": get_user_prompt(prompt, html)},
            ],
        )
        llm_response = response.choices[0].message.content

    if not llm_response:
        return html

    return extract_html_from_response(llm_response) or html


def extract_html_from_response(response_text: str) -> Optional[str]:
    start_index = response_text.find("<")
    end_index = response_text.rfind(">")

    if start_index != -1 and end_index != -1 and end_index > start_index:
        return response_text[start_index : end_index + 1]

    return None
