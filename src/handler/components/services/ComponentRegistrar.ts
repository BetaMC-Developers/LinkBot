import path from "node:path";
import config from "../../../config";
import type { ExtendedClient } from "../../core/ExtendedClient";
import { emptyComponentCollections } from "../../types/ComponentCollections";
import { Features } from "../../types/Features";
import { LogManager } from "../../utils/LogManager";
import { ModuleManager } from "../../utils/ModuleManager";
import { Button } from "../base/Button";
import { Modal } from "../base/Modal";
import { SelectMenu } from "../base/SelectMenu";

type Component = Button | Modal | SelectMenu;

export class ComponentRegistrar {
	private static readonly folderPath: string = path.join(__dirname, `../../../${config.componentsFolder}`);

	static async registerComponents(client: ExtendedClient): Promise<void> {
		try {
			const componentFiles: string[] = await ModuleManager.getAllModulePaths(this.folderPath);
			const componentModules: any[] = await Promise.all(componentFiles.map(ModuleManager.importModule));
			componentModules.forEach((module, index: number): void =>
				this.registerComponent(client, module, componentFiles[index]),
			);
		} catch (error) {
			LogManager.logError("Error registering components", error);
		}
	}

	static async reloadComponents(client: ExtendedClient): Promise<void> {
		try {
			client.components = emptyComponentCollections;
			await ModuleManager.clearModulesInDirectory(this.folderPath);
			await this.registerComponents(client);
		} catch (error) {
			LogManager.logError("Error reloading components", error);
		}
	}

	private static registerComponent(client: ExtendedClient, componentModule: any, filePath: string): void {
		const { default: component } = componentModule;

		if (!this.isValidComponent(component)) {
			LogManager.logError(`Invalid component in file: ${filePath}. Expected an instance of a Component class.`);
			return;
		}

		if (component instanceof Button && client.isEnabledFeature(Features.Buttons)) {
			client.components.button.set(component.customId, component);
		} else if (component instanceof SelectMenu && client.isEnabledFeature(Features.SelectMenus)) {
			client.components.selectMenu.set(component.customId, component);
		} else if (component instanceof Modal && client.isEnabledFeature(Features.Modals)) {
			client.components.modal.set(component.customId, component);
		}
	}

	private static isValidComponent(component: any): component is Component {
		return component instanceof Button || component instanceof SelectMenu || component instanceof Modal;
	}
}
