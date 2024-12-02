import { Collection } from "discord.js";
import type { Button } from "../components/base/Button";
import type { Modal } from "../components/base/Modal";
import type { SelectMenu } from "../components/base/SelectMenu";

export type ComponentCollections = {
	button: Collection<string, Button>;
	modal: Collection<string, Modal>;
	selectMenu: Collection<string, SelectMenu>;
}

export const emptyComponentCollections: ComponentCollections = {
	button: new Collection<string, Button>(),
	selectMenu: new Collection<string, SelectMenu>(),
	modal: new Collection<string, Modal>(),
};
