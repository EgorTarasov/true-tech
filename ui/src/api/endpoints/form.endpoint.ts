import { FormDto } from "api/models/form.model";
import api from "api/utils/api";

export namespace FormEndpoint {
  export const getTemplates = () => {
    return api.get<{ forms: FormDto.Item[] }>("/form/list");
  };

  export const createForm = (form: FormDto.Template) => {
    return api.post<FormDto.Item>("/form/create", form);
  };

  export const getFields = () => {
    return api.get<{ fields: FormDto.Field[] }>("/form/fields");
  };
}
