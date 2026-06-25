import { BadRequestException,Controller,Get,Param,Post,UnauthorizedException,UploadedFile,UseInterceptors,Headers } from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { diskStorage } from "multer";
import * as path from "path";
import * as fs from "fs";
import { IMAGE_REGISTRY,getImagesByPage,getImageSlotById } from "./image-registry";

const IMAGES_BASE_DIR = process.env.IMAGES_BASE_DIR ?? "/var/www/mateyou";

function verifyAdminToken(token: string | undefined): void {
  const p = process.env.ADMIN_IMAGE_PASSWORD ?? "mateyou-admin-2024";
  if (!token || token !== p) throw new UnauthorizedException("密码错误");
}

@Controller("admin/images")
export class ImageAdminController {
  @Get()
  getAll(@Headers("x-admin-token") token: string) {
    verifyAdminToken(token);
    return { byPage: getImagesByPage(), total: IMAGE_REGISTRY.length };
  }

  @Get(":id")
  getOne(@Headers("x-admin-token") token: string, @Param("id") id: string) {
    verifyAdminToken(token);
    const s = getImageSlotById(id);
    if (!s) throw new BadRequestException("槽位不存在");
    return s;
  }

  @Post(":id/upload")
  @UseInterceptors(FileInterceptor("file", {
    storage: diskStorage({
      destination: (req: any, file: any, cb: any) => {
        const s = getImageSlotById(req.params["id"]);
        if (!s) return cb(new BadRequestException("槽位不存在"), "");
        const dir = path.join(IMAGES_BASE_DIR, path.dirname(s.path));
        fs.mkdirSync(dir, { recursive: true });
        cb(null, dir);
      },
      filename: (req: any, file: any, cb: any) => {
        const s = getImageSlotById(req.params["id"]);
        if (!s) return cb(new BadRequestException("槽位不存在"), "");
        cb(null, path.basename(s.path));
      },
    }),
    fileFilter: (req: any, file: any, cb: any) => {
      if (!["image/jpeg","image/png","image/webp"].includes(file.mimetype))
        return cb(new BadRequestException("只支持JPG/PNG/WebP"), false);
      cb(null, true);
    },
    limits: { fileSize: 10 * 1024 * 1024 },
  }))
  uploadImage(
    @Headers("x-admin-token") token: string,
    @Param("id") id: string,
    @UploadedFile() file: any,
  ) {
    verifyAdminToken(token);
    if (!file) throw new BadRequestException("请选择文件");
    const s = getImageSlotById(id);
    if (!s) throw new BadRequestException("槽位不存在");
    return {
      success: true,
      message: `图片"${s.name}"已更新`,
      imageUrl: `/${s.path}`,
      uploadedAt: new Date().toISOString(),
      fileSize: `${(file.size / 1024).toFixed(1)}KB`,
    };
  }

  @Post("auth/verify")
  verifyAuth(@Headers("x-admin-token") token: string) {
    verifyAdminToken(token);
    return { valid: true };
  }
}
// 已在文件末尾，不需要添加
