import { UserDto } from "@/api/models/user.dto";

export namespace Auth {
  export type Authenticated = {
    state: "authenticated";
    user: UserDto.Item;
  };

  export type Anonymous = {
    state: "anonymous";
  };

  export type Loading = {
    state: "loading";
  };

  export type State = Authenticated | Anonymous | Loading;
}
