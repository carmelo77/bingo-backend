import { Container } from 'inversify';
import { UserRepository } from '../repository/UserRepository';
import { RoleRepository } from '../repository/RoleRepository';
import { AuthAdminMiddleware } from '../middleware/AuthAdminMiddleware';
import { AuthMiddleware } from '../middleware/AuthMiddleware';
import { TypeCardWinnerRepository } from '../repository/TypeCardWinnerRepository';
import { BingoCardRepository } from '../repository/BingoCardRepository';
import { BingoNumberRepository } from '../repository/BingoNumberRepository';
import { TYPES } from '../types/';


const container = new Container();
container.bind<UserRepository>(TYPES.UserRepository).to(UserRepository).inSingletonScope();
container.bind<RoleRepository>(TYPES.RoleRepository).to(RoleRepository).inSingletonScope();
container.bind<AuthAdminMiddleware>(TYPES.AuthAdminMiddleware).to(AuthAdminMiddleware).inSingletonScope();
container.bind<AuthMiddleware>(TYPES.AuthMiddleware).to(AuthMiddleware).inSingletonScope();
container.bind<TypeCardWinnerRepository>(TYPES.TypeCardWinnerRepository).to(TypeCardWinnerRepository).inSingletonScope();
container.bind<BingoCardRepository>(TYPES.BingoCardRepository).to(BingoCardRepository).inSingletonScope();
container.bind<BingoNumberRepository>(TYPES.BingoNumberRepository).to(BingoNumberRepository).inSingletonScope();

export default container;