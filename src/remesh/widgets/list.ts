import { merge } from 'rxjs';
import { map } from 'rxjs/operators';
import { Remesh } from '../remesh';

export type ListWidgetOptions<T> = {
  name: string;
  getKey: (item: T) => string;
  createItem: (key: string) => T;
};

export const ListWidget = <T>(options: ListWidgetOptions<T>) => {
  return Remesh.widget((domain) => {
    const KeyListState = domain.state<string[]>({
      name: `${options.name}.KeyListState`,
      default: [],
    });

    const ItemState = domain.state<string, T>({
      name: `${options.name}.ItemState`,
      impl: (key) => {
        return options.createItem(key);
      },
    });

    const KeyListQuery = domain.query({
      name: `${options.name}.KeyListQuery`,
      impl: ({ get }) => {
        return get(KeyListState());
      },
    });

    const ItemQuery = domain.query({
      name: `${options.name}.ItemQuery`,
      impl: ({ get }, key: string) => {
        return get(ItemState(key));
      },
    });

    const ItemListQuery = domain.query({
      name: `${options.name}.ItemListQuery`,
      impl: ({ get }) => {
        return get(KeyListQuery()).map((key) => get(ItemQuery(key)));
      },
    });

    const setList = domain.command({
      name: `${options.name}.setList`,
      impl: ({}, list: T[]) => {
        const keyList = list.map(options.getKey);

        return [
          KeyListState().new(keyList),
          ...list.map((item) => ItemState(options.getKey(item)).new(item)),
        ];
      },
    });

    const addItem = domain.command({
      name: `${options.name}.addItem`,
      impl: ({ get }, newItem: T) => {
        const keyList = get(KeyListQuery());
        const newKey = options.getKey(newItem);

        if (keyList.includes(newKey)) {
          return [];
        }

        return [
          KeyListState().new(keyList.concat(newKey)),
          ItemState(newKey).new(newItem),
        ];
      },
    });

    const removeItem = domain.command({
      name: `${options.name}.removeItem`,
      impl: ({ get }, targetKey: string) => {
        const keyList = get(KeyListState());
        const newKeyList = keyList.filter((key) => key !== targetKey);

        return KeyListState().new(newKeyList);
      },
    });

    const updateItem = domain.command({
      name: `${options.name}.updateItem`,
      impl: ({ get }, newItem: T) => {
        const key = options.getKey(newItem);
        const keyList = get(KeyListState());

        if (!keyList.includes(key)) {
          return addItem(newItem);
        }

        return ItemState(key).new(newItem);
      },
    });

    const autorun = domain.task({
      name: `${options.name}.autorun`,
      impl: ({ fromEvent }) => {
        const setList$ = fromEvent(setList.Event).pipe(
          map((todoContent) => setList(todoContent))
        );

        const addItem$ = fromEvent(addItem.Event).pipe(
          map((todoContent) => addItem(todoContent))
        );

        const removeItem$ = fromEvent(removeItem.Event).pipe(
          map((todoContent) => removeItem(todoContent))
        );

        const updateItem$ = fromEvent(updateItem.Event).pipe(
          map((todoContent) => updateItem(todoContent))
        );

        return merge(setList$, addItem$, removeItem$, updateItem$);
      },
    });

    return {
      autorun: [autorun],
      event: {
        setLIst: setList.Event,
        addItem: addItem.Event,
        removeItem: removeItem.Event,
        updateItem: updateItem.Event,
      },
      query: {
        KeyListQuery,
        ItemListQuery,
        ItemQuery,
      },
    };
  })();
};