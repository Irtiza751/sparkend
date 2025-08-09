# Architecture

src/
├── config/            # Configuration files for global use
├── auth/              # auth module
│    ├── config/       # local cofig files
│    ├── entities/     # example (session entitty)
│    ├── social/       # for social signin (google, facebook, etc...)
│    ├── strategies/   # Local, Jwt, or Social sigin strategies
│    └── dto/          # dto for request validation
├── classes/           # Utility or Abstract base classes
├── interfaces/        # Object shapes with interfaces
├── role/              # role module
├── user/              # user module
├── migrations/        # Database migrations
└── seeders/           # Database seeders