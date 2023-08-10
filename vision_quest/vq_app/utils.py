
from serpapi import GoogleSearch
api_key = "66678e1ad49d4ce51eadc41af1aea56d15f7d078807042cc51ac798f8dd60508"

def image_search(obj_name):
    params = {

        "api_key": "66678e1ad49d4ce51eadc41af1aea56d15f7d078807042cc51ac798f8dd60508",
        "engine": "google_images",
        "google_domain": "google.co.uk",
        "q": obj_name,
        "hl": "en",
        "gl": "uk",
        "location": "United Kingdom"
    }
    search = GoogleSearch(params)
    image_results = search.get_dict()["images_results"]
    first_10_image_results = image_results[:10] if len(image_results) >= 10 else image_results
    for result in first_10_image_results:
        if "related_content_id" in result:
            return result["related_content_id"]
    return None


def get_related(obj_name):
    print("obj_name,",obj_name)
    related_content_id = image_search(obj_name)
    if related_content_id:
        print("realted_id",related_content_id)
        params = {
            "api_key": api_key,
            "engine": "google_images_related_content",
            "hl": "en",
            "gl": "uk",
            "related_content_id": related_content_id
        }
        search = GoogleSearch(params)
        related_results = search.get_dict()["related_content"]
        first_5_related_results = related_results[:5] if len(related_results) >= 5 else related_results
        selected_fields = [{"title": item["title"], "link": item["link"], "original": item["original"]} for item in first_5_related_results]
        return selected_fields