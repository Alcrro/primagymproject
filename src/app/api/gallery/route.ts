import gallery from "@/app/_core/gallery";

export async function GET(){
    try {
        return Response.json(gallery)
    } catch (error) {
        console.log(error);
    }
}