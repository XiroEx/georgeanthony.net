import { Card, CardContent } from "./ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";


export default function ServiceDialogue({
    cardContent,
    title,
    slogan,
    content
}: {
    cardContent: React.ReactNode,
    title: string,
    slogan: string,
    content: React.ReactNode

}) {

    return (
        <Dialog>
            <DialogTrigger>
              <Card className="cursor-pointer hover:shadow-lg text-left">
                <CardContent className="p-6">
                  {cardContent}
                </CardContent>
              </Card>
            </DialogTrigger>
            <DialogContent className="p-0 pt-8 pb-6">
              <DialogHeader>
                <DialogTitle className="text-[#7200a2] text-center">
                  {title}
                </DialogTitle>
                <DialogDescription className="text-center"> {slogan} </DialogDescription>
                {content}
              </DialogHeader>
            </DialogContent>
        </Dialog>
    )
}