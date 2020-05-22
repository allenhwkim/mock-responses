import { Controller, Get, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';
import * as path from 'path';
import * as fs from 'fs';

@Controller('developer')
export class DeveloperController {

  // @Get('')
  // @Get('assets')
  @Get('*')
  home(@Req() req: Request, @Res() res: Response) {
    console.log('............... dirname', {__dirname, cwd: process.cwd()});
    const clientDir = fs.existsSync(path.join(__dirname, '../client/index.html'));
    if (req.path.match(/^\/developer\/$/)) {
      const clientIndexHtml = path.resolve(path.join(__dirname, '../client/index.html'));
      res.sendFile(clientIndexHtml);
    } else if (req.path.match(/^\/developer\//)) {
      const filePath = '../client' + req.path.replace('/developer','');
      const assetPath = path.resolve(path.join(__dirname, filePath));
      res.sendFile(assetPath)
    } else  {
      res.status(404).send();
    }
  }
}
   