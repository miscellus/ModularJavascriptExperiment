(function(top, undefined) {
	"use strict";
	const modules = {};
	const moduleNames = [];

	top.module = function(name, dependencies, moduleCode) {
		if (modules[name] === undefined) {
			modules[name] = {dependencies: dependencies, moduleCode: moduleCode, exports: null};
			moduleNames.push(name);
		}
		else {
			console.error("Attempt to redifine module '"+name+"'.");
		}
	};
 
	/* Consider this instead:
	top.module.use = function(name) {
		if (moduleNames[name]) {

		}
	}
	*/

	function endModuleStream () {
		function resolveModule(mod, name, dependencyChain, trace) {
			if (mod.exports === null) {
				let args = {};
				for (let i = mod.dependencies.length; --i >= 0;) {
					let dep, depName;
					dep = modules[depName = mod.dependencies[i]];
					const traceWithDep = [...trace, depName];

					if (dep === undefined) {
						console.error("[Module loader error]: Undefined module! '"+name+"' depends on a module, '"+depName+"', which is undefined.");
						args[depName] = {};
					}
					else if (dependencyChain[depName]) {
						console.error("[Module loader error]: Circular dependency! '"+name+"' and '"+depName+"' depend on each other, here is the dependency chain:\n\t"+traceWithDep.join(' → '));
						args[depName] = {};
					}
					else {
						args[depName] = resolveModule(dep, depName, {[depName]: true, ...dependencyChain}, traceWithDep);
					}
						
				}
				mod.exports = mod.moduleCode(args);
			}

			return mod.exports;
		}

		for (let i = moduleNames.length; --i >= 0;) {
			let modName = moduleNames[i];
			resolveModule(modules[modName], modName, {[modName]: true}, [modName]);
		}
	}

	window.addEventListener("DOMContentLoaded", endModuleStream, false);
})(window);