module("createPool", [], function() {
	return function (factory, sizeIncrement) {
		
		const pool = {};
		const elements = pool.elements = [];
		pool.activeSize = 0;
		
		(function expand() {
			for (let i = elements.length, o = i + sizeIncrement; i < o; ++i) {
				elements.push(Object.assign(factory(), {index: i}));
			}
			console.log(elements.length);
		}());
		
		pool.create = () => {
			if (pool.activeSize >= elements.length) expand();
			const obj = elements[pool.activeSize];
			++pool.activeSize;
			return obj;
		};
		
		pool.destroy = (obj) => {
			--pool.activeSize;

			const a = pool.activeSize;
			const b = obj.index;

			// swap indicies on objects
			[elements[a].index, obj.index] = [obj.index, elements[a].index];

			// swap objects in pool
			[elements[a], elements[b]] = [elements[b], elements[a]];
		}
		
		pool.eachActive = (visitFunction) => {
			for (let i = pool.activeSize-1; i >= 0; --i) {
				visitFunction(elements[i]);
			}
		}
		
		return pool;
	};
});