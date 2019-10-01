import { CatsService } from './cats.service';
import { CreateCatDto } from './dto/create-cat.dto';
export declare class CatsController {
    private readonly catsService;
    constructor(catsService: CatsService);
    findAll(request: Request): string;
    getDocs(version: any): {
        url: string;
    };
    findOne(params: any): string;
    create(createCatDto: CreateCatDto, res: any): string;
    update(id: string, updateCatDto: any): string;
    remove(id: string): string;
}
