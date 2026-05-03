import multer from "multer";

const storage = multer({storage: multer.diskStorage({})})

export default storage;
